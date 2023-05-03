import { createSlice, type PayloadAction } from "@reduxjs/toolkit"


const initialState = {
  isMenuCollapse: false
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsMenuCollapse (state, action: PayloadAction<boolean>) {
      state.isMenuCollapse = action.payload
    }
  }

})

export const { setIsMenuCollapse } = appSlice.actions

export default appSlice.reducer
