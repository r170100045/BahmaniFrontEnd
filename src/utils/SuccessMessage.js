import { Paper } from "@material-ui/core";
import React from "react";
import { green } from "@material-ui/core/colors";

class SuccessMessage extends React.Component {
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
            color: green[500],
            padding: "60px 50px",
          }}
        >
          <span> {this.props.action} SUCCESSFULLY</span>
        </Paper>
      </div>
    );
  }
}

export default SuccessMessage;
