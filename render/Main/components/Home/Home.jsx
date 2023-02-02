import { HiPencil, HiUser } from "react-icons/hi";

export function Home() {
  return (
    <div className="flex flex-col overflow-auto min-h-[calc(100vh-32px)]">
      <div className="bg-base-100 draggable p-12">
        Do some background with this
      </div>

      {/* <div className="divider"></div> */}
      <div className="flex flex-row px-12 py-4 gap-6 items-center">
        <div className="flex-1">
          {/* <b>Profile</b> */}
          {/* <select className="select select-md select-bordered w-full ">
            <option disabled selected>
              Profile
            </option>
            <option>Latest</option>
            <option>1.12.2</option>
          </select> */}

          <div className="dropdown w-full">
            <label tabIndex={0} className="flex flex-row items-center gap-4">
              <HiUser className="w-1/3" />
              <button className="btn btn-ghost btn-outline w-2/3">
                Latest
              </button>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-compact text-sm p-2 shadow bg-base-100 rounded-box w-full"
            >
              <li>
                <a className="bordered">Latest</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1">
          <button className="btn btn-primary w-full loading">Launch</button>
        </div>
        <div className="flex-1 text-sm">
          <div className="flex flex-row items-center gap-4">
            <div className="font-bold">Player_Nguyen </div>
            <button className="btn btn-ghost btn-sm">
              <HiPencil />
            </button>{" "}
          </div>
          <div>Latest</div>
          <div>1.19.2</div>
        </div>
      </div>
      <div className="divider mx-12"></div>
    </div>
  );
}
