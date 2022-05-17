import React from "react";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageHeight: {
    overflow: "auto",
    height: "90vh",
  },
  pageTitle: {
    textAlign: "left",
    fontSize: "20px",
    margin: "auto 24px ",
    padding: "10px",
    textTransform: "capitalize",
    fontWeight: "bolder",
    color: "#0c0b0b",
  },
}));

function CommonPage(props) {
  const {
    action,
    id,
    personId,
    title,
    viewAll,
    viewEach,
    addOrEdit,
    addPrompt,
  } = props;
  const classes = useStyles();

  return (
    <>
      <div className={classes.pageHeight}>
        <p className={classes.pageTitle}>{title}</p>
        {action === "view" && id === "all" && viewAll}
        {action === "view" && id !== "all" && viewEach}
        {action === "edit" && id === "add" && personId === "add" && addPrompt}
        {personId !== "add" && action === "edit" && addOrEdit}
      </div>
    </>
  );
}

export default CommonPage;
