import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import "antd/dist/reset.css"
import { ConfigProvider } from "antd"
import { HelmetProvider } from "react-helmet-async"
import "./index.css"
import { App as MyAntdApp } from "antd"
import { MessageBoxProvider } from "./context/MessageBoxContext"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <ConfigProvider>
      <MyAntdApp>
      <MessageBoxProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
        </MessageBoxProvider>
      </MyAntdApp>
    </ConfigProvider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
