import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import SystemService from "../../services/SystemService"
export const initialState = {
  settings: null,
}

export const update_or_insert_system_info = createAsyncThunk(
  "/systemInfo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await SystemService.update_or_insert(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const getSystemInfo = createAsyncThunk(
  "/systemInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SystemService.getSystemInfo()
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const systemInfo = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(update_or_insert_system_info.pending, (state) => {
        state.loading = true
      })
      .addCase(update_or_insert_system_info.fulfilled, (state, action) => {
        state.loading = false
        state.settings = action.payload
      })
      .addCase(update_or_insert_system_info.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
  },
})

export const { setSettings } = systemInfo.actions

export default systemInfo.reducer
