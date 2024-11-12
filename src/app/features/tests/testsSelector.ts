import { RootState } from "../../store";

export const selectTests = (state: RootState) => state.testsStore.tests;
