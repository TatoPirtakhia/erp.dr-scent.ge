import { createAsyncThunk } from "@reduxjs/toolkit"
import CompanyTypeService from "../../services/CompanyTypeService"

export const addCompanyType = createAsyncThunk(
  "api/companyType",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CompanyTypeService.addCompanyType(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const getCompanyType = createAsyncThunk(
  "api/companyType",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CompanyTypeService.getCompanyType()
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const editCompanyType = createAsyncThunk(
    "api/companyType",
    async (data, { rejectWithValue }) => {
      try {
        const response = await CompanyTypeService.editCompanyType(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  

export const deleteCompanyType = createAsyncThunk(
  "api/companyType",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CompanyTypeService.deleteCompanyType(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
