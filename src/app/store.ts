import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import batchReducer from "./features/batches/batchSlice";
import userReducer from "./features/user/userSlice";
import testsReducer from "./features/tests/testsSlice";
import { initializeAuth } from "./features/auth/authService";

export const store = configureStore({
  reducer: {
    authStore: authReducer,
    batchStore: batchReducer,
    userStore: userReducer,
    testsStore: testsReducer,
  },
});

store.dispatch(initializeAuth());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
