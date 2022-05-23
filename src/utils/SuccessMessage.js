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
          fontFamily: "Roboto",
          fontSize: 50,
          color: green[500],
          height: "80vh",
        }}
      >
        <p> {this.props.action} successfully</p>
      </div>
    );
  }
}

export default SuccessMessage;
