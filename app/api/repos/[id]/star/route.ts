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

    const repo = await IdeaRepo.findById(id);
    if (!repo) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      );
    }

    const userIdString = session.user.id;
    const hasStarred = repo.stars.some(
      (id: any) => id.toString() === userIdString
    );

    if (hasStarred) {
      // Unstar
      repo.stars = repo.stars.filter(
        (id: any) => id.toString() !== userIdString
      );
      repo.starCount = Math.max(0, repo.starCount - 1);
    } else {
      // Star
      repo.stars.push(session.user.id as any);
      repo.starCount += 1;
    }

    await repo.save();

    return NextResponse.json({
      starred: !hasStarred,
      starCount: repo.starCount,
    });
  } catch (error) {
    console.error('Toggle star error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle star' },
      { status: 500 }
    );
  }
}
