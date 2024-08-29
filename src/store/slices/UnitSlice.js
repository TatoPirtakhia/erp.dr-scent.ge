import { createAsyncThunk } from "@reduxjs/toolkit";
import UnitService from "../../services/UnitService";

export const get_unit = createAsyncThunk(
  "api/unit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UnitService.get_unit();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const add_unit = createAsyncThunk(
  "api/unit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UnitService.add_unit(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const edit_unit = createAsyncThunk(
  "api/unit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UnitService.edit_unit(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const delete_unit = createAsyncThunk(
  "api/unit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UnitService.delete_unit(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);
