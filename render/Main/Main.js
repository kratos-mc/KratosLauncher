import React from "react";
import { createRoot } from "./../react";
import App from "./components/App";

createRoot(document.getElementById(`app`)).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
