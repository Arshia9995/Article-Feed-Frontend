// src/components/Login.tsx
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userLogin } from '../redux/actions/authAction';
import { makeErrorDisable } from '../redux/reducers/authSlice';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

// Login form data interface
interface ILoginData {
  email: string;
  password: string;
}

// Validation Schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Debug: Log the entire Redux state
  const fullUserState = useAppSelector((state) => state.user);
  console.log('Full Redux user state:', fullUserState);
  console.log('User from state:', user);
  console.log('Loading:', loading);
  console.log('Error:', error);

  const initialValues: ILoginData = {
    email: '',
    password: '',
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 15px rgba(99, 102, 241, 0.5)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  // Redirect on successful login - Updated to navigate to home page
  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    if (user) {
      console.log('User found, attempting navigation to home page:', user);
      try {
        navigate("/", { replace: true });
        console.log('Navigation called successfully');
      } catch (navError) {
        console.error('Navigation error:', navError);
      }
    } else {
      console.log('No user found, not navigating');
    }
  }, [user, navigate]);

  // Handle form submission
  const handleSubmit = async (values: ILoginData) => {
    console.log('Form submission started with values:', values);
    try {
      console.log('Dispatching userLogin action...');
      const result = await dispatch(userLogin(values));
      console.log('Login action result:', result);
      
      if (userLogin.fulfilled.match(result)) {
        console.log('Login successful, payload:', result.payload);
        console.log('User from payload:', result.payload?.user);
        
        // Force immediate navigation as backup
        if (result.payload?.user) {
          console.log('Attempting immediate navigation...');
          navigate("/", { replace: true });
        } else {
          console.log('No user in payload, cannot navigate');
        }
      } else if (userLogin.rejected.match(result)) {
        console.log('Login rejected:', result.payload);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Clear error on component unmount
  useEffect(() => {
    return () => {
      dispatch(makeErrorDisable());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-5"></div>
      <motion.div
        className="relative bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 space-y-8 border border-white/30"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome Back
          </h2>
          <p className="text-center text-sm text-gray-600 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-100 text-red-700 p-4 rounded-lg text-sm text-center font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                  <Mail className="ml-3 text-gray-400" size={18} />
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-3 bg-transparent outline-none text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                  <Lock className="ml-3 text-gray-400" size={18} />
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-3 py-3 bg-transparent outline-none text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
              </div>

              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  /> */}
                  {/* <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label> */}
                {/* </div> */}

                {/* <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition"
                >
                  Forgot password?
                </button> */}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <LogIn size={18} />
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div> */}

              {/* Social Login Buttons */}
              {/* <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </motion.button>

                <motion.button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.113.221.083.343-.09.377-.293 1.191-.334 1.358-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                  GitHub
                </motion.button>
              </div> */}

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition"
                >
                  Sign Up
                </button>
              </p>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Login;