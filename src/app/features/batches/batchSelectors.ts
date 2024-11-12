import { RootState } from "../../store";

export const selectBatches = (state: RootState) => state.batchStore.batches;
