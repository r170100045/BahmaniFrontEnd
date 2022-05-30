import { Paper } from "@material-ui/core";
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
          height: "60vh",
        }}
      >
        <Paper
          style={{
            backgroundColor: "#d7ecd7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Roboto",
            fontSize: 50,
            color: red[500],
          }}
        >
          <p>FrontEnd ${`<-->`} Backend Communication Failure</p>
          <p>{this.props.message}</p>
        </Paper>
      </div>
    );
  }
}

export default ErrorLoadingData;
