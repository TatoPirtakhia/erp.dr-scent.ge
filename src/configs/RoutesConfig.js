import React from "react"
import { AUTH_PREFIX_PATH } from "../configs/AppConfig"

export const publicRoutes = [
  {
    key: "login",
    path: `/`,
    component: React.lazy(() =>
      import("../views/auth-views/authentication/login")
    ),
  },
  {
    key: "forgot-password",
    path: `${AUTH_PREFIX_PATH}/forgot-password`,
    component: React.lazy(() =>
      import("../views/auth-views/authentication/forgot-password")
    ),
  },
]

export const protectedRoutes = [
  {
    key: "dashboard.default",
    path: `/home`,
    user_type: [1,2],
    component: React.lazy(() => import("../views/sidenav/dashboards/default")),
  },
  {
    key: "dashboard.products",
    path: `/products`,
    user_type: [1,2],
    component: React.lazy(() => import("../views/sidenav/products/products")),
  },
  {
    key: "dashboard.clients",
    path: `/clients`,
    user_type: [1],
    component: React.lazy(() => import("../views/sidenav/users/clients")),
  },
  {
    key: "dashboard.settings",
    path: `/settings/*`,
    user_type: [1,2],
    component: React.lazy(() => import("../views/sidenav/settings")),
  },
  
]
