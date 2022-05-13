import { MenuItem, MenuList, Paper, makeStyles } from "@material-ui/core";
import React, { useState } from "react";

import { Link } from "react-router-dom";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  sideMenu: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: "0px",
    height: "100%",
    color: "white",
  },
  paper: {
    margin: "2vh",
    marginTop: "12vh",
  },
  link: {
    textDecoration: "none",
    color: "#5f6163",
    fontSize: 16,
  },
  activeLink: {
    textDecoration: "none",
    color: "#5f6163",
    fontSize: 16,
  },
}));

export default function SideMenu() {
  const classes = useStyles();
  const [linkClass, setLinkClass] = useState("link");
  //window.location.pathname && and change the class of that link classes.active
  return (
    <div className={classes.sideMenu}>
      <Paper className={classes.paper}>
        <MenuList>
          <MenuItem>
            <Link to="/addressHierarchyLevel/view/all" className={classes.link}>
              Address Hierarchy
            </Link>
          </MenuItem>
          <MenuItem>
            <Link className={classes.link} to="/concept/view/all">
              Concepts
            </Link>
          </MenuItem>
          <MenuItem>
            <Link className={classes.link} to="/drug/view/all">
              Medication Data
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              className={classes.link}
              to="/patientRelationshipType/view/all"
            >
              Patient Relationships
            </Link>
          </MenuItem>

          <MenuItem>
            <Link className={classes.link} to="/personAttributeType/view/all">
              Person Attributes
            </Link>
          </MenuItem>
          <MenuItem>
            <Link className={classes.link} to="/user/view/all">
              Users
            </Link>
          </MenuItem>
          <MenuItem>
            <Link className={classes.link} to="/role/view/all">
              Roles
            </Link>
          </MenuItem>
          <MenuItem>
            <Link className={classes.link} to="/privilege/view/all">
              Privileges
            </Link>
          </MenuItem>
          <MenuItem>
            <Link className={classes.link} to="/visitType/view/all">
              Visit Types
            </Link>
          </MenuItem>
        </MenuList>
      </Paper>
    </div>
  );
}
