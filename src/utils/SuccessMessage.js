import { Paper, Snackbar } from "@material-ui/core";

import React from "react";

class SuccessMessage extends React.Component {
  render() {
    return (
      <Snackbar
        open
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Paper
          style={{
            padding: "0.5rem 3rem",
            backgroundColor: "#558855",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <span>{`${this.props.action} Successfully`}</span>
        </Paper>
      </Snackbar>
    );
  }
}

export default SuccessMessage;
