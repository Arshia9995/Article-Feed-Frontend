import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../config/api"; 


interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  const fetchLatestArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/article/latest', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (data.success) {
        
        const mappedArticles: Article[] = data.articles.map((article: any) => ({
          id: article._id,
          title: article.title,
          excerpt: article.content.length > 100 ? article.content.substring(0, 100) + '...' : article.content, 
          date: new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          image: article.images && article.images.length > 0 ? article.images[0] : 'https://via.placeholder.com/600x400', 
        }));
        setArticles(mappedArticles);
      } else {
        throw new Error(data.message || 'Failed to fetch latest articles');
      }
    } catch (err: any) {
      console.error('Error fetching latest articles:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load latest articles');
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Latest Articles</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Latest Articles</h2>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchLatestArticles}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Latest Articles</h2>
      {articles.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
            >
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-indigo-700">{article.title}</h3>
                <p className="text-sm text-gray-500">{article.date}</p>
                <p className="mt-2 text-gray-700">{article.excerpt}</p>
                <a href={`/article/${article.id}`} className="inline-block mt-4 text-indigo-600 hover:underline">
                  Read More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ArticleList;