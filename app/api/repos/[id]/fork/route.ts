import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { IdeaRepo } from '@/models/IdeaRepo';
import { auth } from '@/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const originalRepo = await IdeaRepo.findById(id);
    if (!originalRepo) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      );
    }

    // Check if repo is public
    if (originalRepo.visibility !== 'public') {
      return NextResponse.json(
        { error: 'Can only fork public repositories' },
        { status: 403 }
      );
    }

    // Check if user is not forking their own repo
    if (originalRepo.owner.toString() === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot fork your own repository' },
        { status: 400 }
      );
    }

    // Create forked repo
    const forkedRepo = await IdeaRepo.create({
      name: originalRepo.name,
      description: originalRepo.description,
      owner: session.user.id,
      visibility: 'public',
      content: originalRepo.content,
      forkedFrom: originalRepo._id,
      tags: originalRepo.tags,
      category: originalRepo.category,
    });

    // Update original repo's fork count and forks array
    originalRepo.forkCount += 1;
    originalRepo.forks.push(forkedRepo._id);
    await originalRepo.save();

    await forkedRepo.populate('owner', 'name email image');
    await forkedRepo.populate('forkedFrom', 'name owner');

    return NextResponse.json({ repo: forkedRepo }, { status: 201 });
  } catch (error) {
    console.error('Fork repo error:', error);
    return NextResponse.json(
      { error: 'Failed to fork repository' },
      { status: 500 }
    );
  }
}
