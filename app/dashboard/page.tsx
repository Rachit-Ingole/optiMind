'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  FolderGit2,
  Plus,
  Lock,
  Globe,
  Star,
  GitFork,
  Eye,
  LogOut,
  Loader2,
  Trash2,
} from 'lucide-react';

interface Repo {
  _id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  starCount: number;
  forkCount: number;
  viewCount: number;
  createdAt: string;
  forkedFrom?: {
    name: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchRepos();
    }
  }, [status, router]);

  const fetchRepos = async () => {
    try {
      const response = await fetch(`/api/repos?userId=${session?.user?.id}`);
      const data = await response.json();
      setRepos(data.repos || []);
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this repository?')) return;

    try {
      const response = await fetch(`/api/repos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRepos(repos.filter((repo) => repo._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete repo:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            OptiMind
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/discover"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Discover
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Idea
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {session?.user?.name}
              </h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Repositories Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FolderGit2 className="w-6 h-6" />
              Your Repositories
            </h2>
            <span className="text-gray-600">{repos.length} repos</span>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-12">
              <FolderGit2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No repositories yet</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-5 h-5" />
                Create your first repository
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {repos.map((repo) => (
                <div
                  key={repo._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/repo/${repo._id}`}
                          className="text-xl font-bold text-purple-600 hover:text-purple-700"
                        >
                          {repo.name}
                        </Link>
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
                        {repo.forkedFrom && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <GitFork className="w-4 h-4" />
                            Forked from {repo.forkedFrom.name}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{repo.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {repo.starCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          {repo.forkCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {repo.viewCount}
                        </span>
                        <span>
                          Updated{' '}
                          {new Date(repo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(repo._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Delete repository"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
