import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    fontSize: "1.5rem",
    margin: "1rem 0",
    textTransform: "capitalize",
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
      <div className={classes.pageTitle}>{title}</div>
      {action === "view" && id === "all" && viewAll}
      {action === "view" && id !== "all" && viewEach}
      {action === "edit" && id === "add" && personId === "add" && addPrompt}
      {personId !== "add" && action === "edit" && addOrEdit}
    </>
  );
}

export default CommonPage;
