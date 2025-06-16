import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Tag, AlertCircle, FileText, Image, Layers, Hash, Sparkles, PenTool } from 'lucide-react';
import axiosInstance from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = [
  'sports', 'politics', 'space', 'technology', 'health',
  'entertainment', 'business', 'science', 'lifestyle', 'education',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const ArticleForm: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }

    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, GIF, and WebP files are allowed';
    }

    return null;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(''); 
    setImage(file);

   
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) { 
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return 'Title is required';
    if (title.trim().length < 5) return 'Title must be at least 5 characters long';
    if (!content.trim()) return 'Content is required';
    if (content.trim().length < 50) return 'Content must be at least 50 characters long';
    if (!category) return 'Category is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

   
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('category', category);
      
      
      tags.forEach(tag => formData.append('tags', tag));
      
      if (image) {
        formData.append('image', image);
      }

      
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axiosInstance.post('/article/create', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
        timeout: 30000, 
      });

      console.log('Article created successfully:', response.data);
      
      
      alert('Article created successfully!');
      
      
      navigate('/my-articles');
      
    } catch (err: any) {
      console.error('Error creating article:', err);
      
      let errorMessage = 'Failed to create article';
      
      if (err.response) {
        
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
        console.error('Server error:', err.response.data);
      } else if (err.request) {
        
        errorMessage = 'Network error. Please check your connection and try again.';
        console.error('Network error:', err.request);
      } else {
        
        errorMessage = err.message || errorMessage;
        console.error('Error:', err.message);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      {/* Elegant Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <PenTool className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Create New Article
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Share your thoughts, insights, and stories with our community. 
              Craft compelling content that engages and inspires readers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          
          {/* Error Alert */}
          {error && (
            <div className="mx-8 mt-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-3 h-3 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Error occurred</h4>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isLoading && uploadProgress > 0 && (
            <div className="mx-8 mt-8 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-sm">Publishing article...</span>
                </div>
                <span className="text-sm font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Article Title <span className="text-red-500">*</span>
                </label>
              </div>
              {/* <p className="text-sm text-gray-600 ml-11">
                Write a compelling title that captures your article's main idea (minimum 5 characters)
              </p> */}
              <div className="ml-11">
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your article title..."
                  required
                  minLength={5}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">
                    {title.length} characters
                  </div>
                  {title.length >= 5 && (
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      </div>
                      Title length is good
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Article Content <span className="text-red-500">*</span>
                </label>
              </div>
              {/* <p className="text-sm text-gray-600 ml-11">
                Write your full article content here. Be detailed and engaging (minimum 50 characters)
              </p> */}
              <div className="ml-11">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                  rows={10}
                  placeholder="Start writing your article content here..."
                  required
                  minLength={50}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500">
                    {content.length} characters
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${content.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${content.length >= 50 ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${content.length >= 50 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    {content.length >= 50 ? 'Content length is sufficient' : `${50 - content.length} more characters needed`}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Category <span className="text-red-500">*</span>
                </label>
              </div>
              {/* <p className="text-sm text-gray-600 ml-11">
                Choose the category that best fits your article's topic
              </p> */}
              <div className="ml-11">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-4 h-4 text-orange-600" />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Tags
                </label>
              </div>
              {/* <p className="text-sm text-gray-600 ml-11">
                Add relevant tags to help readers discover your article (maximum 10 tags)
              </p> */}
              <div className="ml-11">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Type a tag and press Enter..."
                    disabled={tags.length >= 10}
                  />
                  <button 
                    type="button" 
                    onClick={addTag} 
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                    disabled={tags.length >= 10 || !tagInput.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                
                {/* Tags Display */}
                {tags.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 shadow-sm">
                          <Tag className="w-3 h-3 text-gray-500" /> 
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tags.length} of 10 tags used
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-indigo-600" />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Featured Image
                </label>
              </div>
              <p className="text-sm text-gray-600 ml-11">
                Upload an image to make your article more engaging (max 5MB, JPG/PNG/GIF/WebP)
              </p>
              <div className="ml-11">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full max-h-64 object-cover rounded-xl border border-gray-200 shadow-sm" 
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Change image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors duration-200">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-indigo-600" />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
                    >
                      Choose Image
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      or drag and drop your image here
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold text-lg disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    saving Article...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    Save Article
                  </div>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Your article will be published immediately after submission
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleForm;