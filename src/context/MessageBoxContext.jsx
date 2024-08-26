import { createContext, useState } from "react"

export const MessageBoxContext = createContext({ isOpen: false })

export const MessageBoxProvider = ({ children }) => {
  const [state, setState] = useState({ isOpen: false })

  function mb(options) {
    setState({
      title: options.title,
      text: options.text,
      cancelText: options.cancelText,
      okText: options.okText,
      okFunction: () => {
        options.okFunction()
        close()
      },
      isOpen: true,
    })
  }

  function close() {
    setState({ isOpen: false })
  }

  return (
    <MessageBoxContext.Provider value={{ mb, close, messageBoxState: state }}>
      {children}
    </MessageBoxContext.Provider>
  )
}
