import { RootState } from "../../store";

export const selectMyTests = (state: RootState) => state.myTestStore.myTests;
