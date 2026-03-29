import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
// import "./styles/theme.css";
import "./index.css";
import "./App.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#071426",
          color: "#fff",
        },
      }}
    />
    </AuthProvider>
  </React.StrictMode>
);
