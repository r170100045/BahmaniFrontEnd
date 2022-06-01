import { Paper, Snackbar } from "@material-ui/core";

import React from "react";
import { red } from "@material-ui/core/colors";

class ErrorLoadingData extends React.Component {
  render() {
    return (
      // <div
      //   style={{
      //     display: "flex",
      //     alignItems: "center",
      //     justifyContent: "center",
      //     height: "60vh",
      //   }}
      // >
      //   <Paper
      //     style={{
      //       backgroundColor: "#d7ecd7",
      //       display: "flex",
      //       alignItems: "center",
      //       justifyContent: "center",
      //       fontFamily: "Roboto",
      //       fontSize: 50,
      //       color: red[500],
      //     }}
      //   >

      //   </Paper>
      // </div>
      <Snackbar open anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Paper
          style={{
            padding: "15px",
            fontSize: "15px",
            backgroundColor: "rgb(228 154 157)",
            border: "1px solid red",
          }}
        >
          <p>FrontEnd {`<-->`} Backend Communication Failure</p>
          <p>{this.props.message}</p>
        </Paper>
      </Snackbar>
    );
  }
}

export default ErrorLoadingData;
