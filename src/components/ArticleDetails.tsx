import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../config/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { ArrowLeft } from 'lucide-react';

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

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/article/articles/${articleId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      if (data.success) {
        setArticle(data.article);
      } else {
        throw new Error(data.message || 'Failed to fetch article');
      }
    } catch (err: any) {
      console.error('Error fetching article:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load article');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Article</h2>
            <p className="text-gray-600 mb-4">{error || 'Article not found'}</p>
            <Link
              to="/my-articles"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to My Articles
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/my-articles"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
          >
            <ArrowLeft size={18} />
            Back to My Articles
          </Link>

          <article className="bg-white rounded-lg shadow-md p-6">
            {article.images && article.images.length > 0 && (
              <img
                src={article.images[0]}
                alt={article.title}
                className="w-full h-64 object-cover rounded-md mb-6"
              />
            )}

            <div className="mb-4">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full capitalize">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

            <p className="text-gray-500 text-sm mb-4">
              By {article.author.firstName || article.author.username} • Published: {formatDate(article.createdAt)}
            </p>

            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{article.content}</p>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Updated: {formatDate(article.updatedAt)}</span>
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
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticleDetail;