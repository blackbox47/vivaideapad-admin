import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileNavOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileNavOpen = action.payload;
    },
    closeMobileNav: (state) => {
      state.mobileNavOpen = false;
    },
  },
});

export const { setMobileNavOpen, closeMobileNav } = uiSlice.actions;

export default uiSlice.reducer;
