import React from "react";
import { Route,Routes } from "react-router-dom";
import Home from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Signup from "../components/SignUp";
import OTPVerification from "../components/OtpVerification";
import ArticleForm from "../components/CreateArticle";
import MyArticles from "../components/MyArticles";
import ArticleDetail from "../components/ArticleDetails";
import EditArticle from "../components/EditArticle";
import Dashboard from "../components/Dashboard";
import Profile from "../components/Profile";


const UserRoutes: React.FC = () => {
        return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<OTPVerification />} />
            <Route path="/create-article" element={<ArticleForm />} />
            <Route path="/my-articles" element={<MyArticles />} />
            <Route path="/articles/:articleId" element={<ArticleDetail />} />
            <Route path="/edit-article/:articleId" element={<EditArticle />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

        </Routes>
    );
};

export default UserRoutes;
    