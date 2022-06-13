import { Paper, Snackbar } from "@material-ui/core";

import React from "react";

class ErrorLoadingData extends React.Component {
  render() {
    return (
      <Snackbar
        open
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Paper
          style={{
            padding: "15px",
            fontSize: "15px",
            backgroundColor: "rgb(228 154 157)",
            border: "1px solid red",
            width: "300px",
            height: 25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>Something went wrong!</span>
        </Paper>
      </Snackbar>
    );
  }
}

export default ErrorLoadingData;
