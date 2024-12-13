import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  gender: string;
  _id: string;
  username: string;
  email: string;
  rank: number;
  role: string;
  lms_score: number;
  batches: string[];
}

type AuthState = {
  authLoading: boolean;
  user: UserProfile | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  authLoading: false,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthLoading, setIsAuthenticated, setUser } =
  authSlice.actions;

export default authSlice.reducer;
