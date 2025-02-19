import React from "react";
import { createRoot } from "react-dom/client";
import "./admin/index.css";
import "./user/index.css"
import App from "./App.jsx";
//import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./user/context/StoreContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreContextProvider>
      <App />  {/* ✅ App already has <BrowserRouter> */}
    </StoreContextProvider>
  </React.StrictMode>
);
