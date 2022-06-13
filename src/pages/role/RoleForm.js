import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import { Redirect, Link as RouterLink, withRouter } from "react-router-dom";
import {
  checkboxLabelStyle,
  childRoleHeading,
  globalError,
  inputInfoStyle,
  inputStyle,
  paperStyle,
  propertyName,
} from "../../constants/formStyling";
import {
  deleteRoleById,
  getRoleById,
  getRoleByName,
  getRoles,
  insertRole,
  updateRoleById,
} from "../../services/roleService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import SuccessMessage from "../../utils/SuccessMessage";
import { getPrivileges } from "../../services/privilegeService";

class RoleForm extends React.Component {
  constructor(props) {
    super(props);
    const initialRoleState = {
      role: null,
      description: null,
      uuid: null,
      parentRoles: [],
      childRoles: [],
      rolePrivileges: [],
    };

    this.state = {
      role: initialRoleState,
      roleId: this.props.match.params.id,
      allRoles: [],
      inheritedRoles: [],
      allPrivileges: [],
      redirect: null,
      isLoading: true,
      showSuccessMessage: false,
      successMessage: null,
      error: false,
      errors: {
        globalErrorMessage: "Please fix all errors and try again.",
        httpRequest: null,
        httpRequestHasError: false,
        role: "role can not be empty",
        roleHasError: false,
      },
    };

    this.viewAll = "/role/view/all";

    this.saveRole = this.saveRole.bind(this);
    this.cancelRole = this.cancelRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.roleChangeHandler = this.roleChangeHandler.bind(this);
    this.roleRolePrivilegesChangeHandler =
      this.roleRolePrivilegesChangeHandler.bind(this);
    this.inheritedRoleChangeHandler =
      this.inheritedRoleChangeHandler.bind(this);
  }

  // component mount starts
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    Promise.all([this.setAllRoles(), this.setAllPrivileges()])
      .then(() => this.setRole())
      .then(() => this.setInheritedRoles())
      .then(() => this.setCurrentPrivileges())
      .then(() => this.disableDisplayPrivileges())
      .then(() => this.setState({ isLoading: false }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState(
        { roleId: this.props.match.params.id, isLoading: true },
        () => {
          this.fetchData();
        }
      );
    }
  }

  setAllRoles() {
    return new Promise((resolve) => {
      getRoles()
        .then((response) => {
          const allRoles = [];
          Object.keys(response.data).forEach((key) => {
            allRoles.push(response.data[key].role);
          });
          this.setState({ allRoles }, () => resolve());
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getRoles", error.message);
        });
    });
  }

  setAllPrivileges() {
    return new Promise((resolve) => {
      getPrivileges()
        .then((response) => {
          const allPrivileges = [];
          Object.keys(response.data).forEach((key) => {
            allPrivileges.push({
              privilege: response.data[key].privilege,
              checked: false,
              disabled: false,
            });
          });
          this.setState({ allPrivileges }, () => resolve());
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getPrivileges", error.message);
        });
    });
  }

  setRole() {
    return new Promise((resolve) => {
      const { roleId } = this.state;
      if (roleId !== "add") {
        getRoleById(roleId)
          .then((response) => {
            this.setState({ role: response.data }, () => {
              resolve();
            });
          })
          .catch((error) => {
            console.log(error);
            this.setHttpError("getRoleById", error.message);
          });
      } else {
        resolve();
      }
    });
  }

  setInheritedRoles() {
    return new Promise((resolve) => {
      const { allRoles, role } = this.state;
      const inheritedRoles = [];

      allRoles.forEach((el) => {
        if (el !== "Anonymous" && el !== "Authenticated") {
          if (role.parentRoles.includes(el)) {
            inheritedRoles.push({
              role: el,
              checked: true,
            });
          } else {
            inheritedRoles.push({
              role: el,
              checked: false,
            });
          }
        }
      });

      this.setState({ inheritedRoles }, () => resolve());
    });
  }

  setCurrentPrivileges() {
    return new Promise((resolve) => {
      const { role, allPrivileges } = this.state;
      const tempAllPrivileges = [...allPrivileges];

      role.rolePrivileges.forEach((rp) => {
        const tapIndex = tempAllPrivileges.findIndex(
          (tap) => tap.privilege === rp
        );
        tempAllPrivileges[tapIndex].checked = true;
      });

      this.setState({ allPrivileges: tempAllPrivileges }, () => resolve());
    });
  }

  disableDisplayPrivileges() {
    return new Promise((resolve) => {
      const { role, allPrivileges } = this.state;
      const tempAllPrivileges = [...allPrivileges];

      if (role.parentRoles.length === 0) {
        resolve();
      } else {
        role.parentRoles.forEach((el, index) => {
          getRoleByName(el)
            .then((response) => {
              const parentRolePrivileges = response.data.rolePrivileges;
              parentRolePrivileges.forEach((prPrivilege) => {
                const tapIndex = tempAllPrivileges.findIndex(
                  (tap) => tap.privilege === prPrivilege
                );
                tempAllPrivileges[tapIndex].disabled = true;
              });
            })
            .then(() => {
              if (index === role.parentRoles.length - 1) {
                this.setState({ allPrivileges: tempAllPrivileges }, () => {
                  resolve();
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.setHttpError("getRoleByName", error.message);
            });
        });
      }
    });
  }
  // component mount ends

  // error validation starts
  setHttpError(apiName, eMessage) {
    const { errors } = this.state;
    errors.httpRequestHasError = true;
    errors.httpRequest = "error: " + apiName + " api call failed : " + eMessage;
    this.setState({ errors });
  }

  nonEmpty(object) {
    return object && object.trim().length > 0;
  }

  resetErrorsToFalse() {
    return new Promise((resolve) => {
      const { errors } = this.state;
      errors.roleHasError = false;
      this.setState({ errors, error: false }, () => resolve());
    });
  }

  successAndRedirect(successMessage) {
    this.setState({ showSuccessMessage: true, successMessage }, () => {
      setTimeout(
        function () {
          this.setState({ redirect: this.viewAll });
        }.bind(this),
        500
      );
    });
  }

  validate(role) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors } = this.state;
        let error = false;

        if (!this.nonEmpty(role.role)) {
          error = true;
          errors.roleHasError = true;
        }

        this.setState({ error, errors, role }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // save starts
  saveRole(successMessage = "Updated") {
    const { roleId, role } = this.state;
    this.validate(role).then(() => {
      const { error } = this.state;
      if (!error) {
        if (roleId === "add") this.insertRoleWithData(role);
        else this.updateRoleWithData(roleId, role, successMessage);
      }
    });
  }

  insertRoleWithData(role) {
    console.log("create", role);
    insertRole(role)
      .then(() => {
        this.successAndRedirect("Saved");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("insertRole", error.message);
      });
  }

  updateRoleWithData(roleId, role, successMessage) {
    console.log("update", role);
    updateRoleById(roleId, role)
      .then(() => {
        this.successAndRedirect(successMessage);
      })
      .catch((error) => {
        console.log(error);
        console.log("in updateRoleById");
        this.setHttpError("updateRoleById", error.message);
      });
  }
  // save ends

  cancelRole() {
    this.setState({ redirect: this.viewAll });
  }

  deleteRole() {
    const { roleId } = this.state;
    deleteRoleById(roleId)
      .then(() => {
        this.successAndRedirect("Deleted");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("deleteRoleById", error.message);
      });
  }

  // input change handlers
  roleChangeHandler(event) {
    const { name, value } = event.target;
    const { role } = this.state;
    role[name] = value;
    this.setState({ role });
  }

  roleRolePrivilegesChangeHandler(event, index) {
    const { allPrivileges, role } = this.state;
    allPrivileges[index].checked = event.target.checked;

    if (event.target.checked) {
      if (!role.rolePrivileges.includes(allPrivileges[index].privilege)) {
        role.rolePrivileges.push(allPrivileges[index].privilege);
      }
    } else {
      if (role.rolePrivileges.includes(allPrivileges[index].privilege)) {
        const tempIndex = role.rolePrivileges.indexOf(
          allPrivileges[index].privilege
        );
        role.rolePrivileges.splice(tempIndex, 1);
      }
    }

    this.setState({ allPrivileges });
  }

  // state change handlers
  inheritedRoleChangeHandler(event, index) {
    const { inheritedRoles, role } = this.state;
    inheritedRoles[index].checked = event.target.checked;

    if (event.target.checked) {
      if (!role.parentRoles.includes(inheritedRoles[index].role)) {
        role.parentRoles.push(inheritedRoles[index].role);
      }
    } else {
      if (role.parentRoles.includes(inheritedRoles[index].role)) {
        const tempIndex = role.parentRoles.indexOf(inheritedRoles[index].role);
        role.parentRoles.splice(tempIndex, 1);
      }
    }

    this.setState({ inheritedRoles });
  }

  render() {
    const {
      saveRole,
      cancelRole,
      roleChangeHandler,
      roleRolePrivilegesChangeHandler,
      inheritedRoleChangeHandler,
    } = this;

    const {
      role,
      roleId,
      inheritedRoles,
      allPrivileges,
      redirect,
      isLoading,
      error,
      errors,
      showSuccessMessage,
      successMessage,
    } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <LoadingData />;

    return (
      <React.Fragment>
        {errors.httpRequestHasError && (
          <ErrorLoadingData message={errors.httpRequest} />
        )}
        {showSuccessMessage && <SuccessMessage action={successMessage} />}
        <Paper style={paperStyle}>
          {error && (
            <span style={globalError}>{errors.globalErrorMessage}</span>
          )}
          <TextField
            error={errors.roleHasError}
            helperText={errors.roleHasError && errors.role}
            style={inputStyle}
            label="Role"
            type="text"
            id="role"
            name="role"
            value={GET_VALUE(role.role)}
            disabled={roleId === "add" ? false : true}
            onChange={(e) => roleChangeHandler(e)}
            required
          />

          <label htmlFor="description">
            <TextField
              style={inputStyle}
              label="Description"
              id="description"
              name="description"
              rows="3"
              cols="20"
              value={GET_VALUE(role.description)}
              onChange={(e) => roleChangeHandler(e)}
            />
          </label>

          {role.childRoles.length > 0 && (
            <div>
              <p style={childRoleHeading}>
                Roles that contain (inherit privileges from) {role.role}
              </p>
              <div style={{ marginLeft: 20 }}>
                {role.childRoles.map((childRole) => (
                  <span key={childRole.uuid} style={{ marginRight: 8 }}>
                    {/* <RouterLink to={`/role/edit/${childRole.uuid}`}>
                      {childRole.childRoleName}
                    </RouterLink> */}
                    <Button size="small">
                      <RouterLink
                        to={`/role/edit/${childRole.uuid}`}
                        style={{ textDecoration: "none" }}
                      >
                        {childRole.childRoleName}
                      </RouterLink>
                    </Button>
                    {/* <a href={`/role/edit/${childRole.uuid}`}>
                      {childRole.childRoleName}
                    </a> */}
                  </span>
                ))}
              </div>

              {/* <ul>
                {role.childRoles.map((childRole) => (
                  <li key={childRole.uuid}>
                    <a href={`/role/edit/${childRole.uuid}`}>
                      {childRole.childRoleName}
                    </a>
                  </li>
                ))}
              </ul> */}
            </div>
          )}

          <div>
            <p style={childRoleHeading}>
              Inherited Roles: ({role.role} inherits privileges from these
              roles)
            </p>
            <div style={{ marginLeft: 20 }}>
              <Grid container spacing={1}>
                {inheritedRoles.map((el, index) => (
                  <Grid key={el.role} item md={4} xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          type="checkbox"
                          name={el.role}
                          checked={el.checked}
                          id={el.role}
                          onChange={(e) => inheritedRoleChangeHandler(e, index)}
                        />
                      }
                      label={<span style={checkboxLabelStyle}>{el.role}</span>}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>

          <div>
            <p style={childRoleHeading}>
              Privileges: (Greyed out checkboxes represent privileges inherited
              from other roles, these cannot be removed individually.)
            </p>
            <div style={{ marginLeft: 20 }}>
              <Grid container spacing={1}>
                {allPrivileges.map((el, index) => (
                  <Grid key={el.privilege} item md={4} xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          type="checkbox"
                          name={el.privilege}
                          checked={el.checked}
                          disabled={el.disabled}
                          id={el.privilege}
                          onChange={(e) =>
                            roleRolePrivilegesChangeHandler(e, index)
                          }
                        />
                      }
                      label={
                        <span style={checkboxLabelStyle}>{el.privilege}</span>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>

          {roleId !== "add" && (
            <div style={{ marginBottom: 12 }}>
              <span style={propertyName}>UUID: </span>
              <span style={inputInfoStyle}>{role.uuid}</span>
            </div>
          )}
          <Grid container style={{ gridGap: 5 }}>
            <Controls.SaveButton onClick={() => saveRole()} />
            <Controls.CancelButton onClick={() => cancelRole()} />
          </Grid>
        </Paper>
        {/* {roleId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deleteRole()}
          />
        )} */}
      </React.Fragment>
    );
  }
}
export default withRouter(RoleForm);
