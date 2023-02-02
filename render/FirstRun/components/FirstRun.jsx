import "./../../styles/import-tailwind.css";
import { GrLaunch, GrLanguage } from "react-icons/gr";

export default function FirstRunSetup() {

  const handleLaunchLauncher = () => {
    
  }

  return (
    <div className="p-12 flex flex-col gap-3">
      <div className="font-bold text-3xl">
        Hello, welcome to <span className="text-primary">Kratos</span>
      </div>
      {/* <div className="flex flex-row items-center gap-6">
        <i>
          <GrLanguage />
        </i>
        Select language
      </div> */}
      {/* <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text text-sm">Auto update</span>
          <input
            type="checkbox"
            checked
            className="checkbox checkbox-primary"
          />
        </label>
      </div> */}
      <div className="mt-12">
        <button className="btn btn-md w-full flex flex-row gap-2 btn-primary" onClick={handleLaunchLauncher}>
          <span className="text-primary-content">
            <GrLaunch />
          </span>
          Let's go
        </button>
      </div>
    </div>
  );
}
