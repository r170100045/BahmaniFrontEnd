import { Paper, Snackbar } from "@material-ui/core";

import React from "react";
import { green } from "@material-ui/core/colors";

class SuccessMessage extends React.Component {
  render() {
    return (
      <Snackbar open anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Paper
          style={{
            padding: "15px",
            fontSize: "15px",
            backgroundColor: "#99dc99",
            border: "1px solid green",
          }}
        >
          {`${this.props.action} SUCCESSFULLY`}
        </Paper>
      </Snackbar>
    );
  }
}

export default SuccessMessage;
