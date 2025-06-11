import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../redux/store';
import axiosInstance from '../config/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { Eye, Edit, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Article {
  _id: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  category: string;
  author: {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
  };
  createdAt: string;
  updatedAt: string;
  views?: number;
  likes?: number;
  dislikes?: number; 
}

const MyArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) {
      fetchUserArticles();
    }
  }, [user]);

  const fetchUserArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/article/getuserarticles', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        throw new Error(data.message || 'Failed to fetch articles');
      }
    } catch (err: any) {
      console.error('Error fetching user articles:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, articleTitle: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${articleTitle}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeleteLoading(articleId);

      const response = await axiosInstance.delete(`/article/articles/${articleId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      if (data.success) {
        setArticles(prev => prev.filter(article => article._id !== articleId));
        toast.success('Article deleted successfully!', {
          duration: 3000,
          position: 'top-right',
        });
      } else {
        throw new Error(data.message || 'Failed to delete article');
      }
    } catch (err: any) {
      console.error('Error deleting article:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to delete article', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(content);
    if (isObjectId) {
      return '[Content Unavailable]'; 
    }
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your articles</h2>
            <Link
              to="/login"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-gray-600">Loading your articles...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Articles</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchUserArticles}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Articles</h1>
              <p className="text-gray-600 mt-2">
                {articles.length > 0 
                  ? `You have created ${articles.length} article${articles.length === 1 ? '' : 's'}`
                  : 'You haven\'t created any articles yet'
                }
              </p>
            </div>
            <Link
              to="/create-article"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Create New Article
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Articles Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't created any articles yet. Start sharing your thoughts and ideas with the world!
              </p>
              <Link
                to="/create-article"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-md font-medium transition inline-flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Create Your First Article
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {article.images && article.images.length > 0 && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={article.images[0]}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full capitalize">
                        {article.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-2">
                      Author Name: {article.author.firstName || article.author.username}
                    </p>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {truncateContent(article.content)}
                    </p>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{article.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created: {formatDate(article.createdAt)}</span>
                      <div className="flex gap-4">
                        {article.views !== undefined && (
                          <span>👁️ {article.views}</span>
                        )}
                        {article.likes !== undefined && (
                          <span>❤️ {article.likes}</span>
                        )}
                        {article.dislikes !== undefined && (
                          <span>👎 {article.dislikes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Link
                        to={`/articles/${article._id}`}
                        className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition-colors"
                        title="View Article"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/edit-article/${article._id}`}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                        title="Edit Article"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(article._id, article.title)}
                        disabled={deleteLoading === article._id}
                        className="p-2 bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-600 disabled:text-red-300 rounded-full transition-colors"
                        title="Delete Article"
                      >
                        {deleteLoading === article._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyArticles;