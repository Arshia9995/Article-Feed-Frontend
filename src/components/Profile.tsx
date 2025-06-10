import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Lock, User, Phone, Mail, Calendar, Tag, Check, AlertCircle, Save, Eye, EyeOff } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { updateProfile, userLogout } from '../redux/actions/authAction';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CATEGORIES = [
  'sports', 'politics', 'space', 'technology', 'health',
  'entertainment', 'business', 'science', 'lifestyle', 'education',
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      email: user?.email || '',
      dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
      password: '',
      confirmPassword: '',
      preferences: user?.preferences || [],
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required('First name is required'),
      lastName: Yup.string().trim().required('Last name is required'),
      email: Yup.string().email('Invalid email address').trim().required('Email is required'),
      phone: Yup.string().trim().required('Phone number is required'),
      dob: Yup.date()
        .nullable()
        .max(new Date(), 'Date of birth cannot be in the future'),
      password: Yup.string().min(8, 'Password must be at least 8 characters long').optional(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null as any], 'Passwords do not match')
        .optional(),
    }),
    onSubmit: async (values) => {
      try {
        const updateData = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          dob: values.dob,
          preferences: values.preferences.map((pref: string) => pref.toLowerCase()),
          ...(values.password && { password: values.password }),
          ...(values.confirmPassword && { confirmPassword: values.confirmPassword }),
        };

        await dispatch(updateProfile(updateData)).unwrap();
        toast.success('Profile updated successfully!', {
          duration: 3000,
          position: 'top-right',
        });
        formik.setFieldValue('password', '');
        formik.setFieldValue('confirmPassword', '');
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    },
  });

  // Load user data on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      formik.setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        password: '',
        confirmPassword: '',
        preferences: user.preferences || [],
      });
    }
  }, [user, navigate]);

  // Toggle category preference
  const togglePreference = (category: string) => {
    const currentPreferences = formik.values.preferences;
    if (currentPreferences.includes(category)) {
      formik.setFieldValue(
        'preferences',
        currentPreferences.filter((pref) => pref !== category)
      );
    } else {
      formik.setFieldValue('preferences', [...currentPreferences, category]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Your Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Manage your personal information and customize your article preferences.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {error && (
            <div className="mx-8 mt-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-sm">Error</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    placeholder="Enter your first name"
                    required
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-sm text-red-600">{formik.errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    placeholder="Enter your last name"
                    required
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-sm text-red-600">{formik.errors.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    placeholder="Enter your email"
                    disabled
                    required
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    placeholder="Enter your phone number"
                    required
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-600">{formik.errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                  />
                  {formik.touched.dob && formik.errors.dob && (
                    <p className="text-sm text-red-600">{formik.errors.dob}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-600" />
                Change Password
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-sm text-red-600">{formik.errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <Tag className="w-6 h-6 text-blue-600" />
                Article Preferences
              </h2>
              <p className="text-sm text-gray-600">
                Select categories you're interested in to personalize your feed.
              </p>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => togglePreference(category)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      formik.values.preferences.includes(category)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {formik.values.preferences.includes(category) && (
                      <Check className="w-4 h-4 inline ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold text-lg disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;