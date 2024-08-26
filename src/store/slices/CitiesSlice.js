import { createAsyncThunk } from "@reduxjs/toolkit"
import CityService from "../../services/CityService"

export const createCity = createAsyncThunk(
  "api/city",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CityService.createCity(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const getCities = createAsyncThunk(
  "api/city",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CityService.getCities(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const editCity = createAsyncThunk(
  "api/city",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CityService.editCity(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const deleteCity = createAsyncThunk(
  "api/city",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CityService.deleteCity(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
