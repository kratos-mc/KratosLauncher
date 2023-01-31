import React from "react";
import { createRoot } from "react-dom/client";
import LoadingApp from "./LoadingApp";

const appElement = document.getElementById("app");
if (appElement === null || appElement === undefined) {
  throw new Error(`appElement cannot be undefined`);
}

createRoot(appElement).render(<LoadingApp />);
