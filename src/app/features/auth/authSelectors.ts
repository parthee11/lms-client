import { RootState } from "../../store";

export const selectIsAuthenticated = (state: RootState) => state.authStore.isAuthenticated;
export const selectUser = (state: RootState) => state.authStore.user;
