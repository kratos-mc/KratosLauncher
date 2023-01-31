import React from "react";
import { createRoot } from "react-dom/client";

const appElement = document.getElementById("app");
if (appElement === null || appElement === undefined) {
  throw new Error(`appElement cannot be undefined`);
}

createRoot(appElement).render(<div></div>);
