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
          <MenuItem
            component={Link}
            to="/addressHierarchyLevel/view/all"
            className={classes.link}
          >
            Address Hierarchy
          </MenuItem>
          <MenuItem
            component={Link}
            to="/concept/view/all"
            className={classes.link}
          >
            Concepts
          </MenuItem>
          <MenuItem
            component={Link}
            to="/drug/view/all"
            className={classes.link}
          >
            Medication Data
          </MenuItem>
          <MenuItem
            component={Link}
            to="/patientRelationshipType/view/all"
            className={classes.link}
          >
            Patient Relationships
          </MenuItem>
          <MenuItem
            component={Link}
            to="/personAttributeType/view/all"
            className={classes.link}
          >
            Person Attributes
          </MenuItem>
          <MenuItem
            component={Link}
            to="/user/view/all/dummy"
            className={classes.link}
          >
            Users
          </MenuItem>
          <MenuItem
            component={Link}
            to="/role/view/all"
            className={classes.link}
          >
            Roles
          </MenuItem>
          <MenuItem
            component={Link}
            to="/privilege/view/all"
            className={classes.link}
          >
            Privileges
          </MenuItem>
          <MenuItem
            component={Link}
            to="/visitType/view/all"
            className={classes.link}
          >
            Visit Types
          </MenuItem>
        </MenuList>
      </Paper>
    </div>
  );
}
