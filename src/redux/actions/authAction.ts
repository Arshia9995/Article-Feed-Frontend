
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IUserSignupData, IOtpVerification, IUpdateProfileData } from "../../types/index";

import { AxiosError } from "axios";
import {  handleError } from "../../config/configuration";
import type { ApiError } from "../../config/configuration";
import axiosInstance from "../../config/api";

// User Signup 
export const userSignup = createAsyncThunk(
  'user/userSignup',
  async (userCredentials: IUserSignupData, { rejectWithValue }) => {
    try {
      console.log("Reached in userSignup action");
      const { data } = await axiosInstance.post("/auth/signup", userCredentials);
      console.log("API Response:", data);
      return data;
    } catch (err: any) {
      console.error("API Error:", err);
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response) {
        if (axiosError.response.data.message === 'Email or phone already exists') {
          return rejectWithValue('Email or phone already exists, please try a different one');
        }
        return rejectWithValue(axiosError.response.data.message);
      }
      return handleError(axiosError, rejectWithValue);
    }
  }
);

// OTP Verification
export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async (otpData: IOtpVerification, { rejectWithValue }) => {
    try {
      console.log("Reached in verifyOtp action");
      const { data } = await axiosInstance.post("/auth/verify-otp", otpData);
      console.log("OTP Verification Response:", data);
      return data;
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response) {
        if (axiosError.response.data.message === 'Invalid or expired OTP') {
          return rejectWithValue('Invalid or expired OTP. Please try again.');
        }
        return rejectWithValue(axiosError.response.data.message);
      }
      return handleError(axiosError, rejectWithValue);
    }
  }
);


// Login 
export const userLogin = createAsyncThunk(
  'user/userLogin',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Login attempt with credentials:', { email: credentials.email });
      console.log('Making API call to /auth/login');
      
      const { data } = await axiosInstance.post('/auth/login', credentials);
      
      console.log('Login API Response:', data);
      return data;
    } catch (err: any) {
      console.error('Login API Error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response?.data?.message) {
        return rejectWithValue(axiosError.response.data.message);
      }
      return rejectWithValue('Login failed');
    }
  }
);


export const userLogout = createAsyncThunk(
  'user/userLogout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Logout attempt started');
      console.log('Making API call to /auth/logout');
      
      const { data } = await axiosInstance.post('/auth/logout');
      
      console.log('Logout API Response:', data);
      return data;
    } catch (err: any) {
      console.error('Logout API Error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response?.data?.message) {
        return rejectWithValue(axiosError.response.data.message);
      }
      return rejectWithValue('Logout failed');
    }
  }
);


// Update Profile 
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: IUpdateProfileData, { rejectWithValue }) => {
    try {
      console.log('Updating profile with data:', profileData);
      const { data } = await axiosInstance.put('/auth/update-profile', profileData, {
        withCredentials: true,
      });
      console.log('Profile Update API Response:', data);
      return data;
    } catch (err: any) {
      console.error('Profile Update API Error:', err);
      const axiosError = err as AxiosError<ApiError>;
      if (axiosError.response?.data?.message) {
        return rejectWithValue(axiosError.response.data.message);
      }
      return handleError(axiosError, rejectWithValue);
    }
  }
);

// Reset Error Action (for clearing errors)
export const resetError = createAsyncThunk(
  'user/resetError',
  async () => {
    return null;
  }
);