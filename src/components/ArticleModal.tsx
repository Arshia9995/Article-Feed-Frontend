import React from 'react';

   interface ArticleModalProps {
     article: {
       title: string;
       category: string;
       author: { firstName: string; lastName: string };
       description: string;
       images: string[];
       tags: string[];
     } | null;
   }

   const ArticleModal: React.FC<ArticleModalProps> = ({ article }) => {
     if (!article) return null;

     return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
           <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
           <p className="text-gray-600 mb-2">Category: {article.category}</p>
           <p className="text-sm text-gray-500 mb-4">
             By {article.author.firstName} {article.author.lastName}
           </p>
           {article.images.length > 0 && (
             <img
               src={article.images[0]}
               alt={article.title}
               className="w-full h-48 object-cover rounded mb-4"
             />
           )}
           <p className="mb-4">{article.description}</p>
           <p className="text-sm text-gray-500">Tags: {article.tags.join(', ')}</p>
           <div className="flex justify-end mt-4">
             <button
               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
             >
               Close
             </button>
           </div>
         </div>
       </div>
     );
   };

   export default ArticleModal;