import React, { useEffect, useState } from "react";
import "./loading.css";

export default function LoadingApp(): React.ReactNode {
  const [message, setMessage] = useState<string>("bootstrapping");
  useEffect(() => {
    console.log(window.versions);
    console.log(`Listen loading:message ...`);

    window.loading.listen((_event, { message }) => {
      setMessage(message);
    });

    return () => {
      window.loading.clean();
    };
  }, []);

  return (
    <div className="px-6 py-12">
      <center className=" flex flex-col gap-4">
        <div className="mb-16">
          <div>Icon here</div>
        </div>
        <div>
          <h1 className="font-bold text-3xl mt-4">Kratos</h1>
          <div className="font-mono text-sm">{message}</div>
          <progress
            className="progress progress-error w-full animate-pulse mt-12"
            value="100"
            max="100"
          ></progress>
        </div>
      </center>
    </div>
  );
}
