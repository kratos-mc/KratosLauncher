import "./../../styles/import-tailwind.css";
import "./../../styles/util.css";
import Sidebar from "./Sidebar/Sidebar";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home/Home";
import { Profile } from "./Profile/Profile";

export default function App() {
  return (
    <>
      <MemoryRouter>
        <div className="app-wrapper overflow-hidden">
          {/*Top bar*/}
          <div className={"draggable h-[32px] bg-primary"}></div>
          {/* Safe area to display */}
          <div
            className={
              "flex flex-row min-h-[calc(100vh-32px)] w-[100vw] overflow-hidden"
            }
          >
            {/* Sidebar wrapper */}
            <div className={"w-[64px] h-full"}>
              <Sidebar />
            </div>
            {/* Content wrapper */}
            <div className={"flex-1 overflow-scroll"}>
              <Routes>
                <Route path="/" element={<Home />} index></Route>
                <Route path="/profile" element={<Profile />}></Route>
              </Routes>
            </div>
          </div>
        </div>
      </MemoryRouter>
    </>
  );
}
