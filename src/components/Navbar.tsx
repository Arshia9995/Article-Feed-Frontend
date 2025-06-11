import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { userLogout } from "../redux/actions/authAction";
import { logoutUser } from "../redux/reducers/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);

  const handleLogout = async () => {
    try {
      console.log('Logout initiated');
      
      
      const result = await dispatch(userLogout() as any);

      console.log("resulttttt", result);
      
      
      if (userLogout.fulfilled.match(result)) {
        console.log('Logout successful, navigating to login');
        navigate("/login", { replace: true });
      } else if (userLogout.rejected.match(result)) {
        console.log('Logout API failed, but clearing local state anyway');
        
        dispatch(logoutUser());
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      dispatch(logoutUser());
      
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight"
          >
            ✨ InsightFeed
          </Link>
          <div className="flex space-x-4 items-center">
            {/* Always show Home */}
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              Home
            </Link>

            {/* Show Dashboard only when user is logged in */}
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-indigo-600 font-medium transition"
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  Settings
                </Link>
                <Link
                  to="/create-article"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  Create Article
                </Link>
                <Link
                  to="/my-articles"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  My Articles
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Logging out...
                    </>
                  ) : (
                    'Logout'
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;