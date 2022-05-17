import React from "react";

class ErrorLoadingData extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>FrontEnd ${`<-->`} Backend Communication Failure</p>
        <p>{this.props.message}</p>
      </div>
    );
  }
}

export default ErrorLoadingData;
