import { CssBaseline, makeStyles } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import AddressHierarchyLevelPage from "../pages/addressHierarchyLevel/AddressHierarchyLevelPage";
import PatientRelationshipTypePage from "../pages/patientRelationshipType/PatientRelationshipTypePage";
import PersonAttributeTypePage from "../pages/personAttributeType/PersonAttributeTypePage";
import VisitTypePage from "../pages/visitType/VisitTypePage";
import DrugPage from "../pages/drug/DrugPage";
import PrivilegePage from "../pages/privilege/PrivilegePage";
import UserPage from "../pages/user/UserPage";
import UserForm from "../pages/user/UserForm";

import "./App.css";
import ConceptPage from "../pages/concept/ConceptPage";
import RolePage from "../pages/role/RolePage";

const useStyles = makeStyles({
  appMain: {
    paddingLeft: "20%",
    width: "100%",
    backgroundColor: "#B7CADB"
  }
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
