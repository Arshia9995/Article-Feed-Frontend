import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  const bannerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <section
      className="relative bg-cover bg-center h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/85 to-pink-900/75"></div>
      <motion.div
        className="absolute top-20 left-20 w-20 h-20 bg-cyan-400 rounded-full opacity-20 blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-40 right-32 w-32 h-32 bg-purple-400 rounded-full opacity-15 blur-2xl"
        animate={{ y: [0, -20, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />
      <motion.div
        className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={bannerVariants}
      >
        <Sparkles className="h-16 w-16 mx-auto mb-4 text-yellow-300 animate-pulse" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Code the Future
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-light leading-relaxed text-gray-100">
          Discover cutting-edge tutorials, innovative coding techniques, and the latest in tech development. Your journey to mastery starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/articles"
            className="bg-white text-indigo-600 font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Browse Articles
          </a>
          <a
            href="/contact"
            className="bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Contact Us
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;