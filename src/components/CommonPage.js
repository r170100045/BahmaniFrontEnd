import React from "react";
import { makeStyles } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  pageHeight: {
    overflow: "auto",
    height: "90vh"
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "20px",
    margin: "2vh",
    padding: "10px",
    textTransform: "capitalize",
    fontWeight: "bolder",
    color: "white",
    backgroundColor: blue["A700"],
    "&:hover": {
      backgroundColor: blue[900]
    }
  }
}));

function CommonPage(props) {
  const { action, id, title, viewAll, viewEach, addOrEdit } = props;
  const classes = useStyles();

  return (
    <>
      <div className={classes.pageHeight}>
        <p className={classes.pageTitle}>{title}</p>
        {action === "view" && id === "all" && viewAll}
        {action === "view" && id !== "all" && viewEach}
        {action === "edit" && addOrEdit}
      </div>
    </>
  );
}

export default CommonPage;
