import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a Batch
export interface Batch {
  _id: string;
  batch_name: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  students: string[]; // Array of student IDs
  tests: string[];    // Array of test IDs
  admin_id: string;
  __v: number;
}

// Define the slice state structure
interface BatchState {
  batchLoading: boolean;
  batches: Batch[] | null; // Array of Batch objects or null
}

const initialState: BatchState = {
  batchLoading: false,
  batches: null,
};

export const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {
    setBatchLoading: (state, action: PayloadAction<boolean>) => {
      state.batchLoading = action.payload;
    },
    setBatches: (state, action: PayloadAction<Batch[]>) => {
      state.batches = action.payload;
    },
  },
});

export const { setBatchLoading, setBatches } = batchSlice.actions;

export default batchSlice.reducer;
