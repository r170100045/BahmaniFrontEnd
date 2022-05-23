import React from "react";
import { red } from "@material-ui/core/colors";

class ErrorLoadingData extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Roboto",
          fontSize: 50,
          color: red[500],
          height: "80vh",
        }}
      >
        <p>FrontEnd ${`<-->`} Backend Communication Failure</p>
        <p>{this.props.message}</p>
      </div>
    );
  }
}

export default ErrorLoadingData;
