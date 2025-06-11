import { createSlice } from "@reduxjs/toolkit";
import { userLogin, userLogout, userSignup, verifyOtp, updateProfile } from "../actions/authAction";
import type { IUserSignupData } from "../../types";
import type { IUser } from "../../types";

interface UserState {
  user: IUser | null;
  error: string | null;
  loading: boolean;
  userDetails: IUser | null;
  signupData: IUserSignupData | null; 
  
  
  OtpVerification: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
  
  messages: any | null;
}

const initialState: UserState = {
  user: null,
  error: null,
  loading: false,
  userDetails: null,
  signupData: null,
  
  OtpVerification: {
    loading: false,
    success: false,
    error: null,
  },
  
  messages: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    makeErrorDisable: (state) => {
      state.error = null;
      state.OtpVerification.error = null;
    },
    clearSignupData: (state) => {
      state.signupData = null;
    },
    resetOtpVerification: (state) => {
      state.OtpVerification = {
        loading: false,
        success: false,
        error: null,
      };
    },
    
    logoutUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.OtpVerification.success = false;
    },
      updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(userSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        console.log(action.payload, "payload in user signup");
        state.loading = false;
        state.signupData = action.meta.arg;
        state.error = null;
      })
      .addCase(userSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(verifyOtp.pending, (state) => {
        state.OtpVerification.loading = true;
        state.OtpVerification.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.OtpVerification.loading = false;
        state.OtpVerification.success = true;
        state.OtpVerification.error = null;
        
        state.user = action.payload.user;
        
        state.signupData = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.OtpVerification.loading = false;
        state.OtpVerification.success = false;
        state.OtpVerification.error = action.payload as string;
      })
      
      
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      .addCase(userLogout.pending, (state) => {
        console.log("pending in logout");
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        console.log("fulfilled in logout");
        state.loading = false;
        state.user = null; 
        state.OtpVerification.success = false;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        console.log("rejected in logout");
        state.loading = false;
        
        state.user = null;
        state.OtpVerification.success = false;
        state.error = action.payload as string | null;
      })
      
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { makeErrorDisable, clearSignupData, resetOtpVerification, logoutUser, updateUser } = userSlice.actions;
export default userSlice.reducer;