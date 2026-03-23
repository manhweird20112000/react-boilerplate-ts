import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  auth: {
    permissions: string[];
  };
}

const initialState: AuthState = {
  auth: {
    permissions: [],
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<string[]>) {
      state.auth.permissions = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
