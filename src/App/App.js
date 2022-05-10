import './App.css';

import { CssBaseline, makeStyles } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';

import AddressHierarchyLevelPage from '../pages/addressHierarchyLevel/AddressHierarchyLevelPage';
import ConceptPage from '../pages/concept/ConceptPage';
import DrugPage from '../pages/drug/DrugPage';
import Header from '../components/Header';
import PatientRelationshipTypePage from '../pages/patientRelationshipType/PatientRelationshipTypePage';
import PersonAttributeTypePage from '../pages/personAttributeType/PersonAttributeTypePage';
import PrivilegePage from '../pages/privilege/PrivilegePage';
import RolePage from '../pages/role/RolePage';
import SideMenu from '../components/SideMenu';
import UserForm from '../pages/user/UserForm';
import UserPage from '../pages/user/UserPage';
import VisitTypePage from '../pages/visitType/VisitTypePage';

const useStyles = makeStyles({
  appMain: {
    paddingLeft: '20%',
    width: '100%',
    backgroundColor: '#B7CADB',
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <>
      <SideMenu />
      <Header />
      <div className={classes.appMain}>
        <Switch>
          <Route path="/patientRelationshipType/:action/:id">
            <PatientRelationshipTypePage />
          </Route>
          <Route path="/personAttributeType/:action/:id">
            <PersonAttributeTypePage />
          </Route>
          <Route path="/addressHierarchyLevel/:action/:id">
            <AddressHierarchyLevelPage />
          </Route>
          <Route path="/visitType/:action/:id">
            <VisitTypePage />
          </Route>
          <Route path="/drug/:action/:id">
            <DrugPage />
          </Route>
          <Route path="/concept/:action/:id">
            <ConceptPage />
          </Route>
          {/* <Route path="/user/add/:personId">
            <UserForm />
          </Route> */}
          <Route path="/user/:action/:id">
            <UserPage />
          </Route>
          <Route path="/role/:action/:id">
            <RolePage />
          </Route>
          <Route path="/privilege/:action/:id">
            <PrivilegePage />
          </Route>
          {/* <Route path="/">
            <TestAutoComplete />
          </Route> */}
        </Switch>
      </div>
      <CssBaseline />
    </>
  );
}
