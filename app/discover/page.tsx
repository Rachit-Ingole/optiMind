'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Search,
  Star,
  GitFork,
  Eye,
  Globe,
  TrendingUp,
  Clock,
  Loader2,
} from 'lucide-react';

interface Repo {
  _id: string;
  name: string;
  description: string;
  owner: {
    name: string;
    email: string;
  };
  starCount: number;
  forkCount: number;
  viewCount: number;
  category: string;
  tags: string[];
  createdAt: string;
}

export default function DiscoverPage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchRepos();
  }, [sortBy]);

  const fetchRepos = async () => {
    try {
      const response = await fetch(`/api/repos?visibility=public&sort=${sortBy}&order=desc`);
      const data = await response.json();
      setRepos(data.repos || []);
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            OptiMind
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title & Search */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Discover Ideas
          </h1>
          <p className="text-gray-600 mb-6">
            Explore innovative ideas from the community
          </p>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900"
            >
              <option value="createdAt">Recently Added</option>
              <option value="starCount">Most Stars</option>
              <option value="forkCount">Most Forks</option>
              <option value="viewCount">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Sort Indicators */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setSortBy('createdAt')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              sortBy === 'createdAt'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            New
          </button>
          <button
            onClick={() => setSortBy('starCount')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              sortBy === 'starCount'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
        </div>

        {/* Repositories Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No repositories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRepos.map((repo) => (
              <Link
                key={repo._id}
                href={`/repo/${repo._id}`}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100 hover:border-purple-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-purple-600 hover:text-purple-700">
                    {repo.name}
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Public
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {repo.description}
                </p>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <span className="font-medium">{repo.owner.name}</span>
                  <span>•</span>
                  <span>{repo.category}</span>
                </div>

                {repo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
