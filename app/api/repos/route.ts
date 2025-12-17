import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { IdeaRepo } from '@/models/IdeaRepo';
import { auth } from '@/auth';

// Get user's repos or public repos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const visibility = searchParams.get('visibility');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    await connectDB();

    const session = await auth();
    const query: any = {};

    if (userId) {
      query.owner = userId;
      // If user is viewing their own repos, show all
      if (session?.user?.id === userId) {
        // No visibility filter
      } else {
        // If viewing someone else's repos, only show public
        query.visibility = 'public';
      }
    } else if (visibility) {
      query.visibility = visibility;
    } else {
      // Default: only public repos
      query.visibility = 'public';
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const repos = await IdeaRepo.find(query)
      .populate('owner', 'name email image')
      .sort({ [sort]: sortOrder })
      .limit(100);

    return NextResponse.json({ repos });
  } catch (error) {
    console.error('Get repos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

// Create new repo
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, visibility, content, tags, category } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const repo = await IdeaRepo.create({
      name,
      description,
      owner: session.user.id,
      visibility: visibility || 'public',
      content: content || {},
      tags: tags || [],
      category: category || 'general',
    });

    await repo.populate('owner', 'name email image');

    return NextResponse.json({ repo }, { status: 201 });
  } catch (error) {
    console.error('Create repo error:', error);
    return NextResponse.json(
      { error: 'Failed to create repository' },
      { status: 500 }
    );
  }
}
