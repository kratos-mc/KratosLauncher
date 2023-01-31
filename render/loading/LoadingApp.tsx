import React, { useEffect } from "react";

export default function LoadingApp(): React.ReactNode {
  useEffect(() => {
    console.log(window.versions);
  }, []);
  return <div></div>;
}
