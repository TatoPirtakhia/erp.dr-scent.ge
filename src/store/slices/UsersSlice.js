import {  createAsyncThunk } from "@reduxjs/toolkit"
import UsersService from "../../services/UsersService"

export const getAdmins = createAsyncThunk(
  "api/getUsers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.getAdmins(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const addAdmins = createAsyncThunk(
  "api/addUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.addAdmins(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const editAdmin = createAsyncThunk(
  "api/editAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.editAdmin(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)


export const getAllClient = createAsyncThunk(
  "api/getAllClient",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.getAllClient(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const getUserData = createAsyncThunk(
  "api/getUserData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await UsersService.getUserData(id)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const getClientData = createAsyncThunk(
  "api/getClientData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await UsersService.getClientData(id)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const getClients = createAsyncThunk(
  "api/getClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UsersService.getClients()
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const getAdminsForClient = createAsyncThunk(
  "api/getAdminsForClient",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UsersService.getAdminsForClient()
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const addClient = createAsyncThunk(
  "api/client",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.addClient(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const addBranch = createAsyncThunk(
  "api/branch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.addBranch(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const editClient = createAsyncThunk(
  "api/client",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.editClient(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const editBranch = createAsyncThunk(
  "api/branch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.editBranch(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const addDocumentImage = createAsyncThunk(
  "api/document",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.addDocumentImage(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const changeClientImage = createAsyncThunk(
  "api/clientImage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.changeClientImage(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const addClientImage = createAsyncThunk(
  "api/images",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.addClientImage(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const changeActive = createAsyncThunk(
  "api/changeActive",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.changeActive(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)


export const verifyEmailManual = createAsyncThunk(
  "api/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UsersService.verifyEmail(data)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
export const delete_Branch = createAsyncThunk(
  "api/verifyEmail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await UsersService.delete_Branch(id)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)
