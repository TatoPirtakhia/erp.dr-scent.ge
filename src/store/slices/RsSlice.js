import { createAsyncThunk } from "@reduxjs/toolkit"
import RsService from "../../services/RsService"

export const createRsSetting = createAsyncThunk(
  "api/createRsSetting",
  async (data, { rejectWithValue }) => {
    try {
      const response = await RsService.createRsSetting(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const editRsSetting = createAsyncThunk(
  "api/editRsSetting",
  async (data, { rejectWithValue }) => {
    try {
      const response = await RsService.editRsSetting(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const getRsSetting = createAsyncThunk(
  "api/getRsSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await RsService.getRsSetting()
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const rs_invoice_a = createAsyncThunk(
  "api/rs_invoice_a",
  async (data, { rejectWithValue }) => {
    try {
      const response = await RsService.rs_invoice_a(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const testRsSetting = createAsyncThunk(
  "api/testRsSetting",
  async (data, { rejectWithValue }) => {
    try {
      const response = await RsService.testRsSetting(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)


export const get_vat_payer_info = createAsyncThunk(
  "api/get_vat_payer_info",
  async (data, { rejectWithValue }) => {
    try {
      const response = await RsService.get_vat_payer_info(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
