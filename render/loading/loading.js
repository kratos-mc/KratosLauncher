import { createRoot } from "./../react";
import LoadingApp from "./LoadingApp";

const appElement = document.getElementById("app");
if (appElement === null || appElement === undefined) {
  throw new Error(`appElement cannot be undefined`);
}

createRoot(appElement).render(<LoadingApp />);
