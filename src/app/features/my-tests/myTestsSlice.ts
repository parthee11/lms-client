// @ts-nocheck

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Test } from "../tests/testsSlice";


// Define the slice state structure
interface MyTestState {
  myTestsLoading: boolean;
  myTests: Test[] | null; // Array of Batch objects or null
}

const initialState: MyTestState = {
  myTestsLoading: false,
  myTests: null,
};

export const myTestsSlice = createSlice({
  name: "my-tests",
  initialState,
  reducers: {
    setMyTestsLoading: (state, action: PayloadAction<boolean>) => {
      state.myTestsLoading = action.payload;
    },
    setMyTests: (state, action: PayloadAction<MyTest[]>) => {
      state.myTests = action.payload;
    },
  },
});

export const { setMyTestsLoading, setMyTests } = myTestsSlice.actions;

export default myTestsSlice.reducer;
