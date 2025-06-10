// src/components/VerifyOTP.tsx
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { verifyOtp } from '../redux/actions/authAction';
import { makeErrorDisable, resetOtpVerification } from '../redux/reducers/authSlice';
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Clock, RefreshCw, ArrowLeft, CheckCircle, Mail } from "lucide-react";

// Validation Schema
const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
    .required('OTP is required'),
});

const VerifyOTP: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  
  const { OtpVerification, loading } = useAppSelector((state) => state.user);
  const email = location.state?.email;

  const initialValues = {
    otp: '',
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

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 200
      } 
    },
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Redirect if no email in location state
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Handle successful OTP verification
  useEffect(() => {
    if (OtpVerification.success) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [OtpVerification.success, navigate]);

  const handleSubmit = async (values: { otp: string }) => {
    if (!email) return;
    
    try {
      await dispatch(verifyOtp({ email, otp: values.otp }));
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = () => {
    setCountdown(600);
    dispatch(resetOtpVerification());
  };

  useEffect(() => {
    return () => {
      dispatch(makeErrorDisable());
    };
  }, [dispatch]);

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-5"></div>
      <motion.div
        className="relative bg-white/90 backdrop-blur-2xl p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 space-y-8 border border-white/30"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Mail className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Verify Your Email
          </h2>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              We've sent a 6-digit code to
            </p>
            <p className="text-sm font-medium text-indigo-600 break-all">
              {email}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {OtpVerification.success ? (
            <motion.div
              className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 p-6 rounded-xl text-center space-y-4"
              initial="hidden"
              animate="visible"
              variants={successVariants}
            >
              <CheckCircle className="mx-auto text-green-500" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Account verified successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Redirecting to your dashboard...
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {OtpVerification.error && (
                <motion.div
                  className="bg-red-100 text-red-700 p-4 rounded-lg text-sm text-center font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {OtpVerification.error}
                </motion.div>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={otpSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="otp" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Shield size={16} />
                        Enter 6-digit verification code
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-xl bg-white/70">
                        <Field
                          type="text"
                          name="otp"
                          maxLength={6}
                          className="w-full px-4 py-3 bg-transparent outline-none text-center text-2xl tracking-widest font-mono"
                          placeholder="• • • • • •"
                        />
                      </div>
                      <ErrorMessage name="otp" component="div" className="text-red-500 text-xs text-center" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-xl">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-gray-500" />
                        {countdown > 0 ? (
                          <span className="text-gray-600">
                            Expires in: <span className="font-semibold text-red-600">{formatTime(countdown)}</span>
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">Code expired</span>
                        )}
                      </div>
                      <motion.button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={countdown > 540}
                        className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        whileHover={{ scale: countdown <= 540 ? 1.05 : 1 }}
                        whileTap={{ scale: countdown <= 540 ? 0.95 : 1 }}
                      >
                        <RefreshCw size={14} />
                        Resend
                      </motion.button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || OtpVerification.loading || countdown === 0}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Shield size={18} />
                      {OtpVerification.loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        'Verify Code'
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => navigate('/signup')}
                      className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft size={16} />
                      Back to signup
                    </motion.button>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;