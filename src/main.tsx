import React from "react"
import ReactDOM from "react-dom/client"
import { SWRConfig } from "swr"

import App from "./App.tsx"
import { localStorageProvider } from "./swr-localstorage-cache-provider.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SWRConfig value={{ provider: localStorageProvider }}>
      <App />
    </SWRConfig>
  </React.StrictMode>,
)
