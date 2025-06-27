import React from "react";
import { ScaleLoader } from "react-spinners";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ScaleLoader color="#e1b400" />
    </div>
  );
}

export default Loader;
