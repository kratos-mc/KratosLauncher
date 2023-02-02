import { useState } from "react";

import { HiHome, HiUser } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [sidebarItems] = useState([
    {
      tooltipName: "Home",
      icon: <HiHome />,
      url: "/",
    },
    {
      tooltipName: "Profile",
      icon: <HiUser />,
      url: "/profile",
    },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const handleRoutePath = (item) => {
    navigate(item.url);
  };

  return (
    <div className={"w-full bg-base-200 min-h-[calc(100vh-32px)]"}>
      {/*Button group wrapper*/}
      <div
        className={
          "flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-32px)] mx-4"
        }
      >
        {sidebarItems &&
          sidebarItems.map((item) => {
            const isActive = item.url === location.pathname;
            const buttonClassName = isActive
              ? `btn btn-ghost rounded-2xl text-primary hover:text-base-content btn-active `
              : `btn btn-ghost rounded-2xl text-base-content hover:text-base-content`;
            return (
              <div
                className="tooltip tooltip-right"
                data-tip={item.tooltipName}
                key={item.url}
              >
                <button
                  className={buttonClassName}
                  onClick={() => handleRoutePath(item)}
                >
                  <i className={"text-lg"}>{item.icon}</i>
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
