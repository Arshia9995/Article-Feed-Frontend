import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ArticleList from "../components/ArticleCard";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 font-sans antialiased">
      <Navbar />
      <HeroSection />
      <ArticleList />
      <Footer />
    </div>
  );
};

export default HomePage;