import { MenuItem, MenuList, Paper, makeStyles } from '@material-ui/core';

import { Link } from 'react-router-dom';
import React from 'react';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  sideMenu: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: '0px',
    width: '20%',
    height: '100%',
    backgroundColor: '#B7CADB',
    color: 'white',
  },
  paper: {
    margin: '2vh',
    marginTop: '12vh',
    height: '100vh',
  },
}));

export default function SideMenu() {
  const classes = useStyles();
  return (
    <div className={classes.sideMenu}>
      <Paper className={classes.paper}>
        <MenuList>
          <MenuItem>
            <Link
              to="/addressHierarchyLevel/view/all"
              style={{ textDecoration: 'none' }}
            >
              Address Hierarchy
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/concept/view/all" style={{ textDecoration: 'none' }}>
              Concepts
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/drug/view/all" style={{ textDecoration: 'none' }}>
              Medication Data
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/patientRelationshipType/view/all"
              style={{ textDecoration: 'none' }}
            >
              Patient Relationships
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/personAttributeType/view/all"
              style={{ textDecoration: 'none' }}
            >
              Person Attributes
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/user/view/all" style={{ textDecoration: 'none' }}>
              Users
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/role/view/all" style={{ textDecoration: 'none' }}>
              Roles
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/privilege/view/all" style={{ textDecoration: 'none' }}>
              Privileges
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/visitType/view/all" style={{ textDecoration: 'none' }}>
              Visit Types
            </Link>
          </MenuItem>
        </MenuList>
      </Paper>
    </div>
  );
}
