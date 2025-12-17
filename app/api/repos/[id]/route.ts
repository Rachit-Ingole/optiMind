import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { IdeaRepo } from '@/models/IdeaRepo';
import { auth } from '@/auth';

// Get single repo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const repo = await IdeaRepo.findById(id)
      .populate('owner', 'name email image bio location')
      .populate('forkedFrom', 'name owner');

    if (!repo) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    const session = await auth();

    // Check if user has access
    if (repo.visibility === 'private') {
      if (!session?.user?.id || session.user.id !== repo.owner._id.toString()) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Increment view count
    repo.viewCount += 1;
    await repo.save();

    return NextResponse.json({ repo });
  } catch (error) {
    console.error('Get repo error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repository' },
      { status: 500 }
    );
  }
}

// Update repo
export async function PUT(
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

    const repo = await IdeaRepo.findById(id);
    if (!repo) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    // Check ownership
    if (repo.owner.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, visibility, content, tags, category } = body;

    if (name) repo.name = name;
    if (description) repo.description = description;
    if (visibility) repo.visibility = visibility;
    if (content) repo.content = content;
    if (tags) repo.tags = tags;
    if (category) repo.category = category;

    await repo.save();
    await repo.populate('owner', 'name email image');

    return NextResponse.json({ repo });
  } catch (error) {
    console.error('Update repo error:', error);
    return NextResponse.json(
      { error: 'Failed to update repository' },
      { status: 500 }
    );
  }
}

// Delete repo
export async function DELETE(
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

    const repo = await IdeaRepo.findById(id);
    if (!repo) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    // Check ownership
    if (repo.owner.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await IdeaRepo.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Repository deleted successfully' });
  } catch (error) {
    console.error('Delete repo error:', error);
    return NextResponse.json(
      { error: 'Failed to delete repository' },
      { status: 500 }
    );
  }
}
