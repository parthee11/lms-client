import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type QuestionOption = {
  _id: string;
  key: number;
  value: string;
};

type Question = {
  _id: string;
  question: string;
  options: QuestionOption[];
  correct_answer: number;
  reasoning: string;
};

export interface Test {
  _id: string;
  test_name: string;
  questions: Question[];
  timing: number;
  positive_scoring: number;
  negative_scoring: number;
  batch_id: string;
  hasHistory?: boolean;
}

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
