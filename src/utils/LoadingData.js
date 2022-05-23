import LoadingSpin from "react-loading-spin";
import React from "react";

class LoadingData extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <LoadingSpin />
      </div>
    );
  }
}

export default LoadingData;
