import { useState } from "react";
import { HiPencil } from "react-icons/hi";

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

  return (
    <div className="px-12 py-6">
      <div className="flex flex-col items-start justify-start h-full min-h-[calc(100vh-32px)] w-full">
        <div className="flex flex-row items-center w-full">
          <div className="font-bold text-3xl mb-4 flex-1">Profile</div>

          <button className="btn btn-ghost btn-xs">
            <HiPencil /> Add
          </button>
        </div>

        <div className=" flex flex-col gap-2 w-full max-h-[300px] h-[300px]">
          {profileList.map((profile) => {
            return <ProfileListItem profile={profile} />;
          })}
        </div>
      </div>
    </div>
  );
}

function ProfileListItem({ profile }) {
  return (
    <div className="px-6 py-2 bg-base-200 w-full rounded-xl flex flex-row items-center border">
      <div className="flex flex-col flex-1">
        <p className="font-bold">{profile.name}</p>
        <p>{profile.minecraftVersion}</p>
      </div>
      <div>
        <ul className="menu menu-horizontal bg-base-100 rounded-box text-sm">
          <li>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </a>
          </li>
          <li>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </a>
          </li>
          <li>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
