import { useEffect, useState } from "react";
import { HiPencil, HiTrash } from "react-icons/hi";

export function Profile() {
  const [profileList, setProfileList] = useState([
    {
      uid: "1",
      name: "Latest",
      minecraftVersion: "1.19.2",
    },
    {
      uid: "2",
      name: "Latest #1",
      minecraftVersion: "1.19.2",
    },
    {
      uid: "3",
      name: "Latest #2",
      minecraftVersion: "1.19.2",
    },
    {
      uid: "4",
      name: "Latest #3",
      minecraftVersion: "1.19.2",
    },

    {
      uid: "5",
      name: "Latest #4",
      minecraftVersion: "1.19.2",
    },
  ]);

  useEffect(() => {
    window.launcher.getProfiles().then((items) => {
      setProfileList(items);
    });

    return () => {
      setProfileList(null);
    };
  }, []);

  return (
    <div className="md:px-24 px-12 py-6">
      <div className="flex flex-col items-start justify-start h-full min-h-[calc(100vh-32px)] w-full">
        <div className="flex flex-row items-center w-full">
          <div className="font-bold text-3xl mb-4 flex-1">Profile</div>

          <button className="btn btn-ghost btn-xs">
            <HiPencil /> Add
          </button>
        </div>

        <div className="divider"></div>

        <div className=" flex flex-col gap-2 w-full max-h-[300px] h-[300px]">
          {profileList &&
            profileList.map((profile) => {
              return <ProfileListItem key={profile.uid} profile={profile} />;
            })}
        </div>
      </div>
    </div>
  );
}

function ProfileListItem({ profile }) {
  return (
    <>
      <div className="px-6 py-2 bg-base-100 w-full rounded-xl flex flex-row items-center border border-neutral hover:neutral-focus shadow-md transition-all">
        <div className="flex flex-col flex-1 text-xl pl-6">
          <p className="font-bold">{profile.name}</p>
          <p className="text-sm">{profile.minecraftVersion}</p>
        </div>
        {/* Right margin items */}
        <div>
          <ul className="menu menu-horizontal bg-base-200 rounded-box">
            <li>
              <a>
                <HiPencil />
              </a>
            </li>
            <li>
              <label className={"text-error"}>
                <HiTrash />
              </label>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
