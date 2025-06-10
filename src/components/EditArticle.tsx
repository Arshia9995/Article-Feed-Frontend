import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../config/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

const EditArticle: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'sports', 'politics', 'space', 'technology', 'health',
    'entertainment', 'business', 'science', 'lifestyle', 'education',
  ];

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/article/articles/${articleId}`);
      const data = response.data;

      if (data.success) {
        setArticle(data.article);
        setFormData({
          title: data.article.title,
          content: data.article.content,
          category: data.article.category,
          tags: data.article.tags.join(', '),
        });
        setImagePreview(data.article.images[0] || null);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!articleId) return;

  try {
    setSubmitting(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('content', formData.content.trim());
    formDataToSend.append('category', formData.category.trim().toLowerCase());
    formDataToSend.append(
      'tags',
      formData.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag)
        .join(',')
    );
    if (image) {
      formDataToSend.append('image', image);
    }
    // Add user ID (assuming it's available in article.author._id)
    if (article?.author?._id) {
      formDataToSend.append('userId', article.author._id);
    }

    const response = await axiosInstance.put(`/article/articles/${articleId}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    
      const data = response.data;

      if (data.success) {
        toast.success('Article updated successfully!', {
          duration: 3000,
          position: 'top-right',
        });
        navigate('/my-articles');
      } else {
        throw new Error(data.message || 'Failed to update article');
      }
    } catch (err: any) {
      console.error('Error updating article:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to update article', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setSubmitting(false);
    }
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

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Article</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                maxLength={200}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={8}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., tech, news, tutorial"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Article Image
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-4 py-2 rounded-md inline-flex items-center gap-2"
                >
                  <Upload size={18} />
                  {image ? 'Change Image' : 'Upload New Image'}
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                to="/my-articles"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md font-medium transition disabled:bg-indigo-300"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block"></div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditArticle;