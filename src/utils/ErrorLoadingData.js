import { Paper, Snackbar } from "@material-ui/core";

import React from "react";

class ErrorLoadingData extends React.Component {
  render() {
    return (
      <Snackbar
        open
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Paper
          style={{
            padding: "0.5rem 3rem",
            backgroundColor: "#BB5555",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          Something went wrong!
        </Paper>
      </Snackbar>
    );
  }
}

export default ErrorLoadingData;
