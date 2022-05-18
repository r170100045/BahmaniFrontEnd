import LoadingSpin from "react-loading-spin";
import React from "react";

class LoadingData extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpin />
      </div>
    );
  }
}

export default LoadingData;
