
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userSignup } from '../redux/actions/authAction';
import { makeErrorDisable } from '../redux/reducers/authSlice';
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Calendar, Lock, UserPlus, Heart, Music, Camera, Gamepad2, Book, Coffee } from "lucide-react";
import type { IUserSignupData } from '../types';


const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  dob: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.user);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const initialValues: IUserSignupData & { confirmPassword: string } = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
    preferences: [],
  };

  
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

  const preferenceOptions = [
    { id: 'technology', label: 'Technology', icon: Gamepad2 },
    { id: 'health', label: 'Health & Fitness', icon: Heart },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'reading', label: 'Reading', icon: Book },
    { id: 'food', label: 'Food & Cooking', icon: Coffee },
  ];

  const handlePreferenceToggle = (preferenceId: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const handleSubmit = async (values: IUserSignupData & { confirmPassword: string }) => {
    const { confirmPassword, ...signupData } = values;
    signupData.preferences = selectedPreferences;
    
    try {
      const result = await dispatch(userSignup(signupData));
      if (userSignup.fulfilled.match(result)) {
        navigate('/otp', { state: { email: signupData.email } });
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(makeErrorDisable());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 relative overflow-hidden py-8">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-5"></div>
      <motion.div
        className="relative bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-xl max-w-2xl w-full mx-4 space-y-6 border border-white/30"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Join InsightFeed
          </h2>
          <p className="text-center text-sm text-gray-600 mt-2">Create your account and get started</p>
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
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                    <User className="ml-3 text-gray-400" size={18} />
                    <Field
                      type="text"
                      name="firstName"
                      className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                      placeholder="First Name"
                    />
                  </div>
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                    <User className="ml-3 text-gray-400" size={18} />
                    <Field
                      type="text"
                      name="lastName"
                      className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                  <Mail className="ml-3 text-gray-400" size={18} />
                  <Field
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                    <Phone className="ml-3 text-gray-400" size={18} />
                    <Field
                      type="tel"
                      name="phone"
                      className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                      placeholder="1234567890"
                    />
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-xs" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dob" className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                    <Calendar className="ml-3 text-gray-400" size={18} />
                    <Field
                      type="date"
                      name="dob"
                      className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                    />
                  </div>
                  <ErrorMessage name="dob" component="div" className="text-red-500 text-xs" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                  <Lock className="ml-3 text-gray-400" size={18} />
                  <Field
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                  <Lock className="ml-3 text-gray-400" size={18} />
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs" />
              </div>

              {/* Preferences Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Select Your Interests (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {preferenceOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = selectedPreferences.includes(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        onClick={() => handlePreferenceToggle(option.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-300'
                            : 'bg-white/70 text-gray-700 border-gray-200 hover:border-indigo-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent size={16} />
                        <span className="text-sm font-medium">{option.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <UserPlus size={18} />
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition"
                >
                  Sign In
                </button>
              </p>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Signup;