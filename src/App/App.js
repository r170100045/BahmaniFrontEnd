import "./App.css";

import { CssBaseline, makeStyles } from "@material-ui/core";
import { Route, Switch, Redirect } from "react-router-dom";

import AddressHierarchyLevelPage from "../pages/addressHierarchyLevel/AddressHierarchyLevelPage";
import ConceptPage from "../pages/concept/ConceptPage";
import DrugPage from "../pages/drug/DrugPage";
import Header from "../components/Header";
import PatientRelationshipTypePage from "../pages/patientRelationshipType/PatientRelationshipTypePage";
import PersonAttributeTypePage from "../pages/personAttributeType/PersonAttributeTypePage";
import PrivilegePage from "../pages/privilege/PrivilegePage";
import RolePage from "../pages/role/RolePage";
import SideMenu from "../components/SideMenu";
import UserPage from "../pages/user/UserPage";
import VisitTypePage from "../pages/visitType/VisitTypePage";

const useStyles = makeStyles({
  appMain: {
    display: "flex",
    backgroundColor: "#EFEFEF",
    height: "calc(100vh - 64px)",
    overflowY: "auto",
    alignItems: "flex-start",
  },
  appBody: {
    flex: 1,
    margin: "1rem",
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <>
      <Header />
      <div className={classes.appMain}>
        <SideMenu />
        <div className={classes.appBody}>
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
            <Route path="/user/:action/:id/:personId">
              <UserPage />
            </Route>
            <Route path="/role/:action/:id">
              <RolePage />
            </Route>
            <Route path="/privilege/:action/:id">
              <PrivilegePage />
            </Route>
            <Route path="">
              <Redirect to="/addressHierarchyLevel/view/all" />
            </Route>
          </Switch>
        </div>
      </div>
      <CssBaseline />
    </>
  );
}
