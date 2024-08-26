import { createAsyncThunk } from "@reduxjs/toolkit"
import ProductService from "../../services/ProductService"

export const get_product = createAsyncThunk(
    "api/product",
    async (_, { rejectWithValue }) => {
      try {
        const response = await ProductService.get_product()
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const getFilteredProduct = createAsyncThunk(
    "api/filteredProduct",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.getFilteredProduct(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const getImportHistory = createAsyncThunk(
    "api/getImportHistory",
    async (id, { rejectWithValue }) => {
      try {
        const response = await ProductService.getImportHistory(id)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const get_product_by_stock_room = createAsyncThunk(
    "api/get_product_by_stock_room",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.get_product_by_stock_room(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  
export const get_product_by_stock_room_from_service = createAsyncThunk(
    "api/get_product_by_stock_room_from_service",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.get_product_by_stock_room_from_service(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  
export const add_product = createAsyncThunk(
    "api/product",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.add_product(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  
export const transfer = createAsyncThunk(
    "api/transfer",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.transfer(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  
export const fill_product = createAsyncThunk(
    "api/fill_product",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.fill_product(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
export const getImports = createAsyncThunk(
    "api/fill_product",
    async (_, { rejectWithValue }) => {
      try {
        const response = await ProductService.getImports()
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  
export const edit_product = createAsyncThunk(
    "api/product",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.edit_product(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  
export const delete_product = createAsyncThunk(
    "api/product",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.delete_product(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )


  export const removeImage = createAsyncThunk(
    "api/removeImage",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.removeImage(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  export const addCategory = createAsyncThunk(
    "api/productCategory",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.addCategory(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  export const editCategory = createAsyncThunk(
    "api/productCategory",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.editCategory(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  export const deleteCategory = createAsyncThunk(
    "api/productCategory",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ProductService.deleteCategory(data)
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
  
  export const getProductCategory = createAsyncThunk(
    "api/productCategory",
    async (_, { rejectWithValue }) => {
      try {
        const response = await ProductService.getProductCategory()
        return response
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Error")
      }
    }
  )
