import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import AuthService from "../../services/AuthService"
import getIPAddress from "../../utils/getIPAddress"
import { browserName } from "react-device-detect"
export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  user: null,
  token: localStorage.getItem("access_token") || null,
}

export const signIn = createAsyncThunk(
  "/login",
  async (data, { rejectWithValue }) => {
    try {
      const ipRes = await getIPAddress()
      const response = await AuthService.login({
        ...data,
        ip: ipRes?.ip || 'Unknown',
        browserName,
      })
      const token = response.accessToken
      localStorage.setItem("access_token", token)
      return { token, user: response.user , settings: response.settings }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const signOut = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("access_token")
})

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginInOAuth()
      const token = response.data.accessToken
      localStorage.setItem("accessToken", token)
      return token
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const signInWithFacebook = createAsyncThunk(
  "auth/signInWithFacebook",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginInOAuth()
      const token = response.data.accessToken
      localStorage.setItem("accessToken", token)
      return token
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const requestPasswordRecovery = createAsyncThunk(
  "api/requestPasswordRecovery",
  async (data, { rejectWithValue }) => {
    const { email } = data
    try {
      await AuthService.sendRecoveryLink({ email })
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error")
    }
  }
)

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    authenticated: (state, action) => {
      state.loading = false
      state.redirect = "/home"
      state.token = action.payload.token
      state.user = action.payload.user
    },
    showAuthMessage: (state, action) => {
      state.message = action.payload
      state.showMessage = true
      state.loading = false
    },
    hideAuthMessage: (state) => {
      state.message = ""
      state.showMessage = false
    },
    signOutSuccess: (state) => {
      state.loading = false
      state.token = null
      state.redirect = "/"
    },
    showLoading: (state) => {
      state.loading = true
    },
    signInSuccess: (state, action) => {
      state.loading = false
      state.token = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.redirect = "/home"
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.token = null
        state.redirect = "/"
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false
        state.token = null
        state.redirect = "/"
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false
        state.redirect = "/"
        state.token = action.payload
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
      .addCase(signInWithFacebook.pending, (state) => {
        state.loading = true
      })
      .addCase(signInWithFacebook.fulfilled, (state, action) => {
        state.loading = false
        state.redirect = "/"
        state.token = action.payload
      })
      .addCase(signInWithFacebook.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
  },
})

export const {
  setUser,
  authenticated,
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  showLoading,
  signInSuccess,
} = authSlice.actions

export default authSlice.reducer
