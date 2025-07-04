export interface IUserSignupData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  password: string;
  preferences?: string[];
}


export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: Date;
  preferences?: string[];
  createdAt: Date;
  updatedAt: Date;
}


export interface IOtpVerification {
  email: string;
  otp: string;
}


export interface ApiError {
  message: string;
  error?: any;
}


export interface IArticle {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  likes?: string[];
  dislikes?: string[];
  blocks?: string[];
  createdAt: string;
  author: {
    _id: string;
    firstName: string;
    email: string;
  };
}

export interface ArticleFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  images: File[];
}

export const CATEGORIES = [
  'Photography', 'Reading', 'Music', 'Technology', 'health & Fitness',
  'Food & Cooking',
];

 export interface IUpdateProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob?: string;
  password?: string;
  preferences: string[];
}

