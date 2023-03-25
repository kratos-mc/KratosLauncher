import { useEffect, useState } from "react";
import { HiPencil, HiUser } from "react-icons/hi";

export function Home() {
  return (
    <div className="flex flex-col overflow-auto min-h-[calc(100vh-32px)]">
      <div className="bg-base-100 draggable p-12">
        Do some background with this
      </div>

      {/* <div className="divider"></div> */}
      <HomeGameController />
      <div className="divider mx-12"></div>
    </div>
  );
}

export function HomeGameController() {
  const [profiles, setProfiles] = useState([]);

  /**
   * Get the profile from main process
   */
  useEffect(() => {
    window.launcher.getProfiles().then((items) => {
      setProfiles(items);
    });

    return () => {
      setProfiles(null);
    };
  }, []);

  const handleLaunchButtonClick = () => {
    window.launcher.launchGameWithProfile(profiles[0].uid);
  };

  return (
    <>
      <div className="flex flex-row px-12 py-4 gap-6 items-center">
        {/* Profile managing */}
        <div className="flex-1">
          <div className="dropdown w-full">
            <label tabIndex={0} className="flex flex-row items-center gap-4">
              <button className="btn btn-ghost btn-outline w-3/4">
                <HiUser className="mr-4" />
                Last played
              </button>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-compact text-sm p-2 shadow bg-base-100 rounded-box w-full"
            >
              {/* <li>
                <a className="bordered">Latest</a>
              </li>
              <li>
                <a>Item 2</a>
              </li> */}
              {profiles &&
                profiles.map(({ uid, minecraftVersion, name }) => {
                  return (
                    <li key={uid} className={"text-xl"}>
                      <a className={`flex flex-row`}>
                        <div className={`flex-1`}>{name}</div>
                        <div>{minecraftVersion}</div>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        {/* Start button */}
        <div className="flex-1">
          <button
            className="btn btn-primary w-full"
            onClick={handleLaunchButtonClick}
          >
            Launch
          </button>
        </div>
        {/* Use managing */}
        <div className="flex-1 text-sm">
          <div className="flex flex-row items-center gap-4">
            <div className="font-bold">Player_Nguyen </div>
            <button className="btn btn-ghost btn-sm">
              <HiPencil />
            </button>
          </div>
          <div>Latest</div>
          <div>1.19.2</div>
        </div>
      </div>
    </>
  );
}
