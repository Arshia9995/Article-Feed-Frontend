import React from "react";
import { Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        <div>
          <h4 className="text-lg font-bold mb-3">InsightFeed</h4>
          <p className="text-sm">Empowering developers with knowledge and practical skills through curated content and resources.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Articles", "Contact", "Login", "Sign Up"].map((link) => (
              <li key={link}>
                <a href={`/${link.toLowerCase().replace(" ", "")}`} className="hover:text-indigo-600">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-3">Contact</h4>
          <p className="flex items-center gap-2 text-sm">
            <Mail size={18} /> support@insightfeed.dev
          </p>
          <p className="flex items-center gap-2 text-sm mt-2">
            <Phone size={18} /> +91 98765 43210
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-500" />
            </a>
            <a href="#">
              <Twitter className="w-5 h-5 text-gray-600 hover:text-sky-400" />
            </a>
            <a href="#">
              <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-700" />
            </a>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 text-center text-sm py-4 text-gray-600">
        © {new Date().getFullYear()} InsightFeed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;