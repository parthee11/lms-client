import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a Batch
export interface Test {}

// Define the slice state structure
interface TestState {
  testsLoading: boolean;
  tests: Test[] | null; // Array of Batch objects or null
}

const initialState: TestState = {
  testsLoading: false,
  tests: null,
};

export const testsSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    setTestsLoading: (state, action: PayloadAction<boolean>) => {
      state.testsLoading = action.payload;
    },
    setTests: (state, action: PayloadAction<Test[]>) => {
      state.tests = action.payload;
    },
  },
});

export const { setTestsLoading, setTests } = testsSlice.actions;

export default testsSlice.reducer;
