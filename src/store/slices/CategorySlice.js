import { createAsyncThunk } from "@reduxjs/toolkit";
import CategoryService from "../../services/CategoryService";
export const add_category = createAsyncThunk(
  "api/category",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoryService.add_category(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);
export const get_category = createAsyncThunk(
  "api/category",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryService.get_category();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);
export const edit_category = createAsyncThunk(
  "api/category",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoryService.edit_category(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);
export const delete_category = createAsyncThunk(
  "api/category",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoryService.delete_category(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);
