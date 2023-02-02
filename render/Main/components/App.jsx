import "./../../styles/import-tailwind.css";
import "./../../styles/util.css";
import Sidebar from "./Sidebar/Sidebar";
import { MemoryRouter } from "react-router-dom";

export default function App() {
  return (
    <>
      <MemoryRouter>
        {/*Top bar*/}
        <div className={"draggable h-[32px] bg-primary-focus"}></div>
        {/* Safe area to display */}
        <div className={"flex flex-row min-h-[calc(100vh-32px)] w-[100vw]"}>
          {/* Sidebar wrapper */}
          <div className={"w-[64px] h-full"}>
            <Sidebar />
          </div>
          <div className={"flex-1"}>bb</div>
        </div>
      </MemoryRouter>
    </>
  );
}
