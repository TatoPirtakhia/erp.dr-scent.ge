import axios from "axios"
import { notification } from "antd"
import { API_BASE_URL } from "../constants/ApiConstant"
import { getTranslation } from "../lang/translationUtils"

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,
})

// Config
const TOKEN_PAYLOAD_KEY = "authorization"

// API Request interceptor
service.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("access_token") || null
    const lang = localStorage.getItem("language") || "ka"
    if (jwtToken) {
      config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${jwtToken}`
    }
    if (lang) {
      config.headers["lang"] = lang
    }

    return config
  },
  (error) => {
    // Do something with request error here
    notification.error({
      message: "Error",
    })

    Promise.reject(error)
  }
)

// API respone interceptor
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    let notificationParam = {
      message: "",
    }
    if (error.response) {
      const { status, data } = error.response
      if (status === 400) {
        if (data && data.error) {
          notificationParam.message = getTranslation(data.error)
          if (data.message) {
            notificationParam.description = getTranslation(data.message)
          }
        } else {
          notificationParam.message = getTranslation(data.message) || "Bad Request"
        }
      } else if (status === 401) {
        notificationParam.message = "Authentication Fail"
        notificationParam.description = "Please login again"
        localStorage.removeItem('access_token')

      } else if (status === 404) {
        notificationParam.message = "Not Found"
      } else if (status === 500) {
        notificationParam.message = "Internal Server Error"
      } else if (status === 508) {
        notificationParam.message = "Time Out"
      } else if (data) {
        notificationParam.message = getTranslation(data.message)
      } else {
        notificationParam.message = "An error occurred"
      }
    } else {
      notificationParam.message = "Network Error"
    }

    notification.error(notificationParam)

    return Promise.reject(error)
  }
)

export default service
