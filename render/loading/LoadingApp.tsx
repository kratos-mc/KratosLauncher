import React, { useEffect } from "react";

export default function LoadingApp(): React.ReactNode {
  useEffect(() => {
    console.log(window.versions);
  }, []);
  return (
    <div>
      <h1>Loading here</h1>
    </div>
  );
}
