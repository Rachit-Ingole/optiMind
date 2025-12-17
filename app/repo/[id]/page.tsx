'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Star,
  GitFork,
  Eye,
  Globe,
  Lock,
  Loader2,
  ArrowLeft,
  User,
  Calendar,
} from 'lucide-react';

interface Repo {
  _id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  owner: {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    location?: string;
  };
  content: {
    originalIdea?: string;
    goal?: string;
    variants?: any[];
    businessInsights?: any;
    analysis?: any;
  };
  forkedFrom?: {
    name: string;
    owner: string;
  };
  starCount: number;
  forkCount: number;
  viewCount: number;
  stars: string[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function RepoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [repo, setRepo] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [starred, setStarred] = useState(false);
  const [forking, setForking] = useState(false);

  useEffect(() => {
    fetchRepo();
  }, [params.id]);

  const fetchRepo = async () => {
    try {
      const response = await fetch(`/api/repos/${params.id}`);
      if (!response.ok) {
        router.push('/discover');
        return;
      }
      const data = await response.json();
      setRepo(data.repo);
      if (session?.user?.id) {
        setStarred(data.repo.stars.includes(session.user.id));
      }
    } catch (error) {
      console.error('Failed to fetch repo:', error);
      router.push('/discover');
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/repos/${params.id}/star`, {
        method: 'POST',
      });
      const data = await response.json();
      setStarred(data.starred);
      if (repo) {
        setRepo({ ...repo, starCount: data.starCount });
      }
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const handleFork = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setForking(true);
    try {
      const response = await fetch(`/api/repos/${params.id}/fork`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        router.push(`/repo/${data.repo._id}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to fork repository');
      }
    } catch (error) {
      console.error('Failed to fork repo:', error);
      alert('Failed to fork repository');
    } finally {
      setForking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!repo) {
    return null;
  }

  const isOwner = session?.user?.id === repo.owner._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            OptiMind
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/discover" className="text-gray-600 hover:text-gray-900">
              Discover
            </Link>
            {session && (
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        {/* Repository Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {repo.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    repo.visibility === 'public'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {repo.visibility === 'public' ? (
                    <Globe className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  {repo.visibility}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-4">{repo.description}</p>

              {repo.forkedFrom && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                  <GitFork className="w-4 h-4" />
                  Forked from <span className="font-medium">{repo.forkedFrom.name}</span>
                </p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-gray-400" />
                <Link
                  href={`/profile/${repo.owner._id}`}
                  className="font-medium text-purple-600 hover:text-purple-700"
                >
                  {repo.owner.name}
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {repo.starCount} stars
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {repo.forkCount} forks
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {repo.viewCount} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {new Date(repo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStar}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${
                  starred
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Star className={`w-4 h-4 ${starred ? 'fill-yellow-500' : ''}`} />
                {starred ? 'Starred' : 'Star'}
              </button>
              {!isOwner && repo.visibility === 'public' && (
                <button
                  onClick={handleFork}
                  disabled={forking}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {forking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <GitFork className="w-4 h-4" />
                  )}
                  Fork
                </button>
              )}
            </div>
          </div>

          {repo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {repo.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Idea Content</h2>

          {repo.content.originalIdea && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Original Idea
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {repo.content.originalIdea}
              </p>
            </div>
          )}

          {repo.content.goal && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Goal</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {repo.content.goal}
              </p>
            </div>
          )}

          {repo.content.variants && repo.content.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Variants
              </h3>
              <div className="grid gap-4">
                {repo.content.variants.map((variant, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-600 mb-2">
                      {variant.title}
                    </h4>
                    <p className="text-gray-700 mb-3">{variant.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Impact:</span>
                        <div className="font-semibold text-blue-600">
                          {variant.scores?.impact}/10
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost:</span>
                        <div className="font-semibold text-green-600">
                          {variant.scores?.cost}/10
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Feasibility:</span>
                        <div className="font-semibold text-purple-600">
                          {variant.scores?.feasibility}/10
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!repo.content.originalIdea &&
            !repo.content.goal &&
            (!repo.content.variants || repo.content.variants.length === 0) && (
              <p className="text-gray-500 text-center py-8">
                No detailed content available
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
