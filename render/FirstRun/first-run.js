import { createRoot } from "./../react";
import FirstRunSetup from "./components/FirstRun";

const appElement = document.getElementById("app");
if (appElement === null || appElement === undefined) {
  throw new Error(`appElement cannot be undefined`);
}

createRoot(appElement).render(<FirstRunSetup />);
