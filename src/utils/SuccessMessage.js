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
            padding: "15px",
            fontSize: "15px",
            backgroundColor: "#99dc99",
            border: "1px solid green",
            width: "300px",
            height: 25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>{`${this.props.action} Successfully`}</span>
        </Paper>
      </Snackbar>
    );
  }
}

export default SuccessMessage;
