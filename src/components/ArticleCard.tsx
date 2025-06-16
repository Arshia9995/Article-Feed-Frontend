// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import axiosInstance from "../config/api"; 


// interface Article {
//   id: string;
//   title: string;
//   excerpt: string;
//   date: string;
//   image: string;
// }

// const ArticleList: React.FC = () => {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchLatestArticles();
//   }, []);

//   const fetchLatestArticles = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axiosInstance.get('/article/latest', {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = response.data;

//       if (data.success) {
        
//         const mappedArticles: Article[] = data.articles.map((article: any) => ({
//           id: article._id,
//           title: article.title,
//           excerpt: article.content.length > 100 ? article.content.substring(0, 100) + '...' : article.content, 
//           date: new Date(article.createdAt).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//           }),
//           image: article.images && article.images.length > 0 ? article.images[0] : 'https://via.placeholder.com/600x400', 
//         }));
//         setArticles(mappedArticles);
//       } else {
//         throw new Error(data.message || 'Failed to fetch latest articles');
//       }
//     } catch (err: any) {
//       console.error('Error fetching latest articles:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to load latest articles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   if (loading) {
//     return (
//       <section className="py-16 px-4 max-w-7xl mx-auto">
//         <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Latest Articles</h2>
//         <div className="flex justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-16 px-4 max-w-7xl mx-auto">
//         <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Latest Articles</h2>
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchLatestArticles}
//             className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition"
//           >
//             Try Again
//           </button>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16 px-4 max-w-7xl mx-auto">
//       <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Latest Articles</h2>
//       {articles.length === 0 ? (
//         <div className="text-center">
//           <p className="text-gray-600">No articles found.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {articles.map((article, index) => (
//             <motion.div
//               key={article.id}
//               className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
//               initial="hidden"
//               animate="visible"
//               variants={cardVariants}
//               transition={{ delay: index * 0.1 }}
//             >
//               <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold text-indigo-700">{article.title}</h3>
//                 <p className="text-sm text-gray-500">{article.date}</p>
//                 <p className="mt-2 text-gray-700">{article.excerpt}</p>
//                 <a href={`/article/${article.id}`} className="inline-block mt-4 text-indigo-600 hover:underline">
//                   Read More
//                 </a>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default ArticleList;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import axiosInstance from "../config/api";
import { Link } from "react-router-dom";

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
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    fetchArticles();
  }, [user]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (user) {
        // For logged-in users: fetch based on preferences or latest
        const preferences = user?.preferences || [];
        
        if (preferences.length > 0) {
          response = await axiosInstance.get('/article/getarticles-by-preferences', {
            params: { categories: preferences.join(',') },
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          response = await axiosInstance.get('/article/latest', {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } else {
        // For non-logged-in users: always fetch latest articles
        response = await axiosInstance.get('/article/latest', {
          headers: { 'Content-Type': 'application/json' },
        });
      }

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
        throw new Error(data.message || 'Failed to fetch articles');
      }
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (e: React.MouseEvent, articleId: string) => {
    if (!user) {
      e.preventDefault();
      // Prevent any navigation for non-logged users
      return;
    }
    // For logged-in users, navigation will proceed normally
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
          {user ? 'Your Articles' : 'Latest Articles'}
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
          {user ? 'Your Articles' : 'Latest Articles'}
        </h2>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchArticles}
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
      <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
        {user ? 'Your Articles' : 'Latest Articles'}
      </h2>

      {articles.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">No articles found.</p>
          {user && (
            <>
              <p className="text-gray-500 mt-2">Try updating your preferences to see more relevant articles.</p>
              <Link
                to="/profile"
                className="inline-block mt-4 text-indigo-600 hover:underline"
              >
                Update Preferences
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Central login overlay for non-logged users */}
          {!user && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center shadow-2xl border border-gray-200 max-w-md mx-4">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Please Login to Unlock</h3>
                <p className="text-gray-600 mb-6">Login to read all articles and get personalized recommendations</p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/login"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}

          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative ${
                !user ? 'blur-sm filter grayscale-50' : ''
              }`}
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
                
                {/* Read More button - only for logged users */}
                {user && (
                  <a 
                    href={`/article/${article.id}`} 
                    className="inline-block mt-4 text-indigo-600 hover:underline"
                  >
                    Read More
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ArticleList;