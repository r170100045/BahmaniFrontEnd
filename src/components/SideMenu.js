import { MenuItem, MenuList, Paper, makeStyles } from "@material-ui/core";
import React, { useState } from "react";

import { Link } from "react-router-dom";
import { blue } from "@material-ui/core/colors";
import { withRouter } from "react-router-dom";

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
    backgroundColor: "#daaeae",
    textDecoration: "none",
    color: "#5f6163",
  },
}));

const navItems = [
  {
    href: "/addressHierarchyLevel/view/all",
    basehref: "/addressHierarchyLevel",
    title: "Address Hierarchy",
  },
  { href: "/concept/view/all", basehref: "/concept", title: "Concepts" },
  { href: "/drug/view/all", basehref: "/drug", title: "Medication Data" },
  {
    href: "/patientRelationshipType/view/all",
    basehref: "/patientRelationshipType",
    title: "Patient Relationships",
  },
  {
    href: "/personAttributeType/view/all",
    basehref: "/personAttributeType",
    title: "Person Attributes",
  },
  { href: "/user/view/all/dummy", basehref: "/user", title: "Users" },
  { href: "/role/view/all", basehref: "/role", title: "Roles" },
  { href: "/privilege/view/all", basehref: "/privilege", title: "Privileges" },
  { href: "/visitType/view/all", basehref: "/visitType", title: "Visit Types" },
];

const NavLink = withRouter((props) => {
  const classes = useStyles();
  const isActive = props.location.pathname.includes(props.navItem.basehref);
  return (
    <MenuItem
      className={isActive ? classes.activeLink : classes.link}
      to={props.navItem.href}
      component={Link}
    >
      {props.navItem.title}
    </MenuItem>
  );
});
export default function SideMenu() {
  const classes = useStyles();
  //window.location.pathname && and change the class of that link classes.active
  return (
    <div className={classes.sideMenu}>
      <Paper className={classes.paper}>
        <MenuList>
          {navItems.map((navItem) => (
            <NavLink key={navItem.href} navItem={navItem} />
          ))}
        </MenuList>
      </Paper>
    </div>
  );
}
