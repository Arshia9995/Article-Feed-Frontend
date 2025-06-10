import React from "react";
import { motion } from "framer-motion";

// Article type definition
interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const ArticleList: React.FC = () => {
  const articles: Article[] = [
    {
      id: 1,
      title: "Introduction to React",
      excerpt: "Learn the basics of React and how to build dynamic web applications.",
      date: "June 1, 2025",
      image:
        "https://images.unsplash.com/photo-1633356122544-f1348c115b37?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Tailwind CSS Tips",
      excerpt: "Master Tailwind CSS with these practical tips and tricks.",
      date: "June 2, 2025",
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Building a Blog with React",
      excerpt: "Step-by-step guide to creating a blog using React and modern tools.",
      date: "June 3, 2025",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      title: "JavaScript ES6 Features",
      excerpt: "Explore the powerful features introduced in ES6 for JavaScript developers.",
      date: "June 4, 2025",
      image:
        "https://images.unsplash.com/photo-1516321310762-479e93c73f1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">Latest Articles</h2>
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
    </section>
  );
};

export default ArticleList;