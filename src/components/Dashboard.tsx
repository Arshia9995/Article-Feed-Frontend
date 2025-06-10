import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/api';
import Navbar from './Navbar';
import Footer from './Footer';
import toast from 'react-hot-toast';
import { Eye, ThumbsUp, ThumbsDown, Ban, Unlock } from 'lucide-react';
import type { RootState } from '../redux/store';
import type { IUser, IArticle } from '../types';

interface Article extends IArticle {
  _id: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  category: string;
  author: {
    _id: string;
    firstName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  likes?: string[];
  dislikes?: string[];
  blocks?: string[];
}

const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;
  const preferences = user?.preferences || [];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          throw new Error('Please log in to view your dashboard.');
        }

        if (preferences.length === 0) {
          setError('No preferences selected. Please update your preferences.');
          return;
        }

        console.log('Fetching articles for preferences:', preferences);
        const response = await axiosInstance.get('/article/getarticles-by-preferences', {
          params: { categories: preferences.join(',') },
          withCredentials: true,
        });

        const data = response.data;
        console.log('Articles response:', data);

        if (data.success) {
          setArticles(data.articles);
        } else {
          throw new Error(data.message || 'Failed to fetch articles');
        }
      } catch (error: any) {
        console.error('Fetch articles error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load articles';
        setError(errorMessage);
        toast.error(errorMessage, { duration: 4000, position: 'top-right' });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [preferences, user]);

  const handleLike = async (articleId: string) => {
    if (!user) {
      toast.error('Please log in to like articles', { duration: 4000, position: 'top-right' });
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/article/articles/like/${articleId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId
              ? {
                  ...article,
                  likes: response.data.article.likes,
                  dislikes: response.data.article.dislikes,
                }
              : article
          )
        );
        toast.success('Article liked!', { duration: 2000, position: 'top-right' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to like article';
      toast.error(errorMessage, { duration: 4000, position: 'top-right' });
    }
  };

  const handleDislike = async (articleId: string) => {
    if (!user) {
      toast.error('Please log in to dislike articles', { duration: 4000, position: 'top-right' });
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/article/articles/dislike/${articleId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId
              ? {
                  ...article,
                  likes: response.data.article.likes,
                  dislikes: response.data.article.dislikes,
                }
              : article
          )
        );
        toast.success('Article disliked!', { duration: 2000, position: 'top-right' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to dislike article';
      toast.error(errorMessage, { duration: 4000, position: 'top-right' });
    }
  };

  const handleBlock = async (articleId: string) => {
    if (!user) {
      toast.error('Please log in to block articles', { duration: 4000, position: 'top-right' });
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/article/articles/block/${articleId}`,
        {},
        { withCredentials: true }
      );
      
      console.log('Block response:', response.data);
      
      if (response.data.success) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId
              ? {
                  ...article,
                  blocks: response.data.article.blocks || [],
                }
              : article
          )
        );
        toast.success('Article blocked!', { duration: 2000, position: 'top-right' });
      }
    } catch (error: any) {
      console.error('Block error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to block article';
      toast.error(errorMessage, { duration: 4000, position: 'top-right' });
    }
  };

  const handleUnblock = async (articleId: string) => {
    if (!user) {
      toast.error('Please log in to unblock articles', { duration: 4000, position: 'top-right' });
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/article/articles/unblock/${articleId}`,
        {},
        { withCredentials: true }
      );
      
      console.log('Unblock response:', response.data);
      
      if (response.data.success) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId
              ? {
                  ...article,
                  blocks: response.data.article.blocks || [],
                }
              : article
          )
        );
        toast.success('Article unblocked!', { duration: 2000, position: 'top-right' });
      }
    } catch (error: any) {
      console.error('Unblock error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to unblock article';
      toast.error(errorMessage, { duration: 4000, position: 'top-right' });
    }
  };

  // Helper function to check if article is blocked by current user
  const isArticleBlocked = (article: Article) => {
    return article.blocks?.includes(user?._id || '') || false;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Error Loading Articles</h3>
            <p className="text-gray-600 mb-4">{error || 'Please log in to view your dashboard.'}</p>
            <Link
              to={user ? '/profile' : '/login'}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md font-medium transition inline-flex items-center gap-2"
            >
              {user ? 'Update Preferences' : 'Log In'}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Personalized Feed</h1>
          
          {articles.length === 0 ? (
            <div className="text-center bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">No articles found for your preferences.</p>
              <Link
                to="/profile"
                className="mt-4 inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md font-medium"
              >
                Update Preferences
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => {
                const blocked = isArticleBlocked(article);
                
                return (
                  <div
                    key={article._id}
                    className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition relative ${
                      blocked ? 'opacity-60 border-2 border-red-200' : ''
                    }`}
                  >
                    {/* Blocked Indicator */}
                    {blocked && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Ban size={12} />
                        Blocked
                      </div>
                    )}
                    
                    {article.images[0] && (
                      <img
                        src={article.images[0]}
                        alt={article.title}
                        className={`w-full h-48 object-cover rounded-md mb-4 ${
                          blocked ? 'grayscale' : ''
                        }`}
                      />
                    )}
                    
                    <h2 className={`text-xl font-semibold mb-2 ${
                      blocked ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      <Link 
                        to={`/articles/${article._id}`} 
                        className={blocked ? 'hover:text-gray-600' : 'hover:text-indigo-600'}
                      >
                        {article.title}
                      </Link>
                    </h2>
                    
                    <p className={`mb-2 line-clamp-3 ${
                      blocked ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {article.content}
                    </p>
                    
                    <div className={`text-sm mb-2 ${
                      blocked ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <p>
                        By{' '}
                        <span className={`font-medium ${
                          blocked ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {article.author.firstName}
                        </span>
                      </p>
                    </div>
                    
                    <div className={`flex justify-between items-center text-sm mb-4 ${
                      blocked ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span>{article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/articles/${article._id}`}
                          className={`${
                            blocked 
                              ? 'text-gray-400 hover:text-gray-500' 
                              : 'text-indigo-600 hover:text-indigo-800'
                          }`}
                          title="View Article"
                        >
                          <Eye size={20} />
                        </Link>
                        
                        <button
                          onClick={() => handleLike(article._id)}
                          disabled={blocked}
                          className={`flex items-center gap-1 ${
                            blocked 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-gray-500 hover:text-indigo-600'
                          }`}
                          title={blocked ? "Unblock to like" : "Like Article"}
                        >
                          <ThumbsUp
                            size={20}
                            className={
                              !blocked && article.likes?.includes(user._id) 
                                ? 'text-indigo-600 fill-indigo-600' 
                                : blocked 
                                ? 'text-gray-400' 
                                : 'text-gray-500'
                            }
                          />
                          <span>{article.likes?.length || 0}</span>
                        </button>
                        
                        <button
                          onClick={() => handleDislike(article._id)}
                          disabled={blocked}
                          className={`flex items-center gap-1 ${
                            blocked 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-gray-500 hover:text-red-600'
                          }`}
                          title={blocked ? "Unblock to dislike" : "Dislike Article"}
                        >
                          <ThumbsDown
                            size={20}
                            className={
                              !blocked && article.dislikes?.includes(user._id) 
                                ? 'text-red-600 fill-red-600' 
                                : blocked 
                                ? 'text-gray-400' 
                                : 'text-gray-500'
                            }
                          />
                          <span>{article.dislikes?.length || 0}</span>
                        </button>
                        
                        {/* Toggle Block/Unblock Button */}
                        {blocked ? (
                          <button
                            onClick={() => handleUnblock(article._id)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800"
                            title="Unblock Article"
                          >
                            <Unlock size={20} />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(article._id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-red-600"
                            title="Block Article"
                          >
                            <Ban size={20} />
                            <span>Block</span>
                          </button>
                        )}
                      </div>
                      
                      {user._id === article.author._id && (
                        <Link
                          to={`/edit-article/${article._id}`}
                          className={
                            blocked 
                              ? 'text-gray-400 hover:text-gray-500' 
                              : 'text-indigo-600 hover:text-indigo-800'
                          }
                        >
                          Edit Article
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;