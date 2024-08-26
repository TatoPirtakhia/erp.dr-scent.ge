import { createAsyncThunk } from '@reduxjs/toolkit';
import CountryService from '../../services/CountryService';

export const createCountry = createAsyncThunk(
    "api/country",
    async (data, { rejectWithValue }) => {
      try {
        const response = await CountryService.createCountry(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const editCountry = createAsyncThunk(
    "api/country",
    async (data, { rejectWithValue }) => {
      try {
        const response = await CountryService.editCountry(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const getCountries = createAsyncThunk(
    "api/getCountries",
    async (_, { rejectWithValue }) => {
      try {
        const response = await CountryService.getCountries()
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const getRegions = createAsyncThunk(
    "api/getRegions",
    async (id, { rejectWithValue }) => {
      try {
        const response = await CountryService.getRegions(id)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const getCities = createAsyncThunk(
    "api/getCities",
    async (id, { rejectWithValue }) => {
      try {
        const response = await CountryService.getCities(id)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const deleteCOuntries = createAsyncThunk(
    "api/counties",
    async (data, { rejectWithValue }) => {
      try {
        const response = await CountryService.deleteCOuntries(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )