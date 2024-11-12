import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateEntityFormValues } from "../../../components/forms/UserForm";

interface UserState {
  users: CreateEntityFormValues[] | null;
}

const initialState: UserState = {
  users: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<CreateEntityFormValues[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;

export default userSlice.reducer;
