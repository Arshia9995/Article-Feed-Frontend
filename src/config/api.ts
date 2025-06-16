import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { baseUrl } from './constants';
import { AxiosError } from 'axios';

export interface ApiError {
    message: string,
    errors: any
}

export interface CustomResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  // timeout: 10000,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});



export const handleError = (error: AxiosError<ApiError>, rejectWithValue: any) => {
  if (error.response) {
    return rejectWithValue(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    return rejectWithValue('Network error. Please try again.');
  } else {
    return rejectWithValue('An unexpected error occurred');
  }
};



export default axiosInstance;