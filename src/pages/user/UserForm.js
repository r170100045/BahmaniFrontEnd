import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  checkboxGroupHeading,
  checkboxLabelStyle,
  deleteButtonStyle,
  globalError,
  inputError,
  inputInfoStyle,
  paperStyle,
  subHeadingStyle,
} from "../../constants/formStyling";
import { getPersonById, getUserById } from "../../services/userService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import SuccessMessage from "../../utils/SuccessMessage";
import { getRoles } from "../../services/roleService";

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    const initialUserState = {
      // userId: 1,
      systemId: null,
      username: null,
      secretQuestion: null,
      secretAnswer: null,
      dateCreated: null,
      // dateChanged: null,
      retired: false,
      // dateRetired: null,
      retireReason: null,
      uuid: null,
      createdBy: null,
      userProperty: [
        {
          // userId: 1,
          // user: null,
          property: "loginAttempts",
          propertyValue: "0",
        },
      ],
      userRoles: [],
      // userRoles: ["bypass2FA", "Provider", "System Developer"],
      person: {
        uuid: null,
        givenName: null,
        middleName: null,
        familyName: null,
        gender: null,
        // concatenatedName: "Super User",
        // personNameUuid: "4ec7e2a4-3f10-11e4-adec-0800271c1b75",
      },
      // personNameUuid: ["4ec7e2a4-3f10-11e4-adec-0800271c1b75"],
      forcePasswordChange: false,
    };

    this.state = {
      user: initialUserState,
      userId: this.props.match.params.id,
      personId: this.props.match.params.personId,
      changePassword: false,
      password: null,
      passwordRetype: null,
      roles: [],
      showAdvancedOptions: false,
      redirect: null,
      isLoading: true,
      showSuccessMessage: false,
      successMessage: null,
      error: false,
      errors: {
        globalErrorMessage: "Please fix all errors and try again.",
        httpRequest: null,
        httpRequestHasError: false,
        personGivenName: "given name can not be empty",
        personGivenNameHasError: false,
        personFamilyName: "family name can not be empty",
        personFamilyNameHasError: false,
        personGender: "gender can not be empty",
        personGenderHasError: false,
        username: "username cannot be empty",
        usernameHasError: false,
        statePassword: "password doesn't satisfy mentioned requirements",
        statePasswordHasError: false,
        statePasswordRetype: "this should match the password entered above",
        statePasswordRetypeHasError: false,
        retireReason: "reason to disable can not be empty",
        retireReasonHasError: false,
      },
    };

    this.viewAll = "/user/view/all/dummy";

    this.saveUser = this.saveUser.bind(this);
    this.disableUser = this.disableUser.bind(this);
    this.enableUser = this.enableUser.bind(this);
    this.cancelUser = this.cancelUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.toggleAdvancedOptions = this.toggleAdvancedOptions.bind(this);
    this.stateChangeHandler = this.stateChangeHandler.bind(this);
    this.userRoleChangeHandler = this.userRoleChangeHandler.bind(this);
    this.userPropertyChangeHandler = this.userPropertyChangeHandler.bind(this);
    this.userPersonChangeHandler = this.userPersonChangeHandler.bind(this);
    this.userChangeHandler = this.userChangeHandler.bind(this);
    // this.providerAccountChangeHandler =
    //   this.providerAccountChangeHandler.bind(this);
  }

  // error validation starts
  setHttpError(apiName, eMessage) {
    const { errors } = this.state;
    errors.httpRequestHasError = true;
    errors.httpRequest = "error: " + apiName + " api call failed : " + eMessage;
    this.setState({ errors }, () => {
      setTimeout(
        function () {
          this.setState({ redirect: this.viewAll });
        }.bind(this),
        4000
      );
    });
  }

  nonEmpty(object) {
    return object && object.trim().length > 0;
  }

  isValidPassword(password) {
    if (password) {
      const minLength = password.length > 7;
      const oneUpperCase = /[A-Z]/.test(password);
      const oneLowerCase = /[a-z]/.test(password);
      const oneDigit = password.search(/[0-9]/) >= 0;
      const oneSpecialChar =
        password.search(/[!@#$%^&*()_+\-={};':"\\|,.<>/?]/) >= 0;

      const isValid =
        minLength && oneUpperCase && oneLowerCase && oneDigit && oneSpecialChar;

      if (isValid) return true;
      return false;
    }
    return false;
  }

  resetErrorsToFalse() {
    return new Promise((resolve) => {
      const { errors } = this.state;
      errors.personGivenNameHasError = false;
      errors.personFamilyNameHasError = false;
      errors.personGenderHasError = false;
      errors.usernameHasError = false;
      errors.statePasswordHasError = false;
      errors.statePasswordRetypeHasError = false;
      errors.retireReasonHasError = false;
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

  validate(user) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors, changePassword, password, passwordRetype } = this.state;
        let error = false;

        if (!this.nonEmpty(user.person.givenName)) {
          error = true;
          errors.personGivenNameHasError = true;
        }

        if (!this.nonEmpty(user.person.familyName)) {
          error = true;
          errors.personFamilyNameHasError = true;
        }

        if (!this.nonEmpty(user.person.gender)) {
          error = true;
          errors.personGenderHasError = true;
        }

        if (!this.nonEmpty(user.username)) {
          error = true;
          errors.usernameHasError = true;
        }

        if (changePassword) {
          if (this.isValidPassword(password)) {
            if (password !== passwordRetype) {
              error = true;
              errors.statePasswordRetypeHasError = true;
            }
          } else {
            error = true;
            errors.statePasswordHasError = true;
          }
        }

        if (user.retired) {
          if (!this.nonEmpty(user.retireReason)) {
            error = true;
            errors.retireReasonHasError = true;
            user.retired = false;
          }
        }

        this.setState({ error, errors, user }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // component mount starts
  componentDidMount() {
    const { userId, personId } = this.state;

    Promise.all([this.setUser(userId, personId), this.setRoles()])
      .then(() => this.setUserRoles())
      .then(() => this.setState({ isLoading: false }));
  }

  setUser(userId, personId) {
    return new Promise((resolve, reject) => {
      if (userId === "add") {
        if (personId !== "dummy") {
          getPersonById(personId)
            .then((response) => {
              const personObj = {
                uuid: null,
                givenName: null,
                middleName: null,
                familyName: null,
                gender: null,
              };

              personObj.uuid = response.data.uuid;
              personObj.givenName = response.data.givenName;
              personObj.middleName = response.data.middleName;
              personObj.familyName = response.data.familyName;
              personObj.gender = response.data.gender;

              const { user } = this.state;
              user.person = personObj;
              this.setState({ user }, () => {
                resolve();
              });
            })
            .catch((e) => reject(e));
        } else {
          resolve();
        }
      } else {
        getUserById(userId)
          .then((response) => {
            console.log("rd", response.data);
            this.setState({ user: response.data }, () => {
              resolve();
            });
          })
          .catch((e) => reject(e));
      }
    });
  }

  setRoles() {
    getRoles()
      .then((response) => {
        const roles = [];
        Object.keys(response.data).forEach((key) => {
          roles.push({
            role: response.data[key].role,
            checked: false,
          });
        });
        return roles;
      })
      .then((roles) => this.setState({ roles }))
      .catch((e) => console.log(e));
  }

  setUserRoles() {
    return new Promise((resolve) => {
      const { roles, user } = this.state;
      const tempRoles = [...roles];
      user.userRoles.forEach((uRole) => {
        const idx = tempRoles.findIndex((role) => role.role === uRole);
        if (tempRoles[idx]) {
          tempRoles[idx].checked = true;
        }
      });
      this.setState({ roles: tempRoles }, () => resolve());
    });
  }
  // component mount ends

  // save starts
  saveUser(successMessage = "UPDATED") {
    const { userId, user, changePassword, password } = this.state;

    this.validate(user).then(() => {
      const { error } = this.state;
      if (!error) {
        if (changePassword) user.password = password;
        if (userId === "add") this.insertUserWithData(user);
        else this.updateUserWithData(userId, user, successMessage);
      }
    });
  }

  insertUserWithData(user) {
    console.log("user", user);
    // insertUser(user)
    //   .then(() => {
    //     this.successAndRedirect("SAVED");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.setHttpError("insertUser", error.message);
    //   });
  }

  updateUserWithData(userId, user, successMessage) {
    console.log("user", user);
    // updateUserById(userId, user)
    //   .then(() => {
    //     this.successAndRedirect(successMessage);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.setHttpError("updateUserById", error.message);
    //   });
  }
  // save ends

  disableUser() {
    const { user } = this.state;
    user.retired = true;
    this.setState({ user }, () => {
      this.saveUser("DISABLED");
    });
  }

  enableUser() {
    const { user } = this.state;
    user.retireReason = null;
    user.retired = false;
    this.setState({ user }, () => {
      this.saveUser("ENABLED");
    });
  }

  cancelUser() {
    this.setState({ redirect: this.viewAll });
  }

  deleteUser() {
    const { userId } = this.state;
    console.log("userId", userId);
    // deleteUserById(userId)
    //   .then(() => {
    //     this.successAndRedirect("DELETED");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.setHttpError("deleteUserById", error.message);
    //   });
  }

  toggleAdvancedOptions() {
    const { showAdvancedOptions } = this.state;
    this.setState({ showAdvancedOptions: !showAdvancedOptions });
  }

  stateChangeHandler(event, type = "value") {
    const { name } = event.target;

    if (name === "changePassword" && event.target[type] === true) {
      this.setState({
        [name]: event.target[type],
        password: null,
        passwordRetype: null,
      });
    } else {
      this.setState({ [name]: event.target[type] });
    }
  }

  userRoleChangeHandler(event, index) {
    const { roles, user } = this.state;
    roles[index].checked = event.target.checked;

    if (event.target.checked) {
      if (!user.userRoles.includes(roles[index].role)) {
        user.userRoles.push(roles[index].role);
      }
    } else {
      if (user.userRoles.includes(roles[index].role)) {
        const tempIndex = user.userRoles.indexOf(roles[index].role);
        user.userRoles.splice(tempIndex, 1);
      }
    }

    this.setState({ roles, user });
  }

  userPropertyChangeHandler(event, index) {
    const { user } = this.state;
    user.userProperty[index].propertyValue = event.target.value;
    this.setState({ user });
  }

  userChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const { user } = this.state;
    user[name] = event.target[type];
    this.setState({ user });
  };

  userPersonChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const user = { ...this.state.user };
    user.person[name] = event.target[type];
    this.setState({ user });
  };

  // providerAccountChangeHandler(event) {
  //   const { user } = this.state;
  //   user.person.providerAccount = event.target.checked;
  //   this.setState({ user });
  // }

  render() {
    const {
      saveUser,
      disableUser,
      enableUser,
      cancelUser,
      deleteUser,
      toggleAdvancedOptions,
      stateChangeHandler,
      userRoleChangeHandler,
      userPropertyChangeHandler,
      userPersonChangeHandler,
      userChangeHandler,
      // providerAccountChangeHandler,
    } = this;

    const {
      user,
      userId,
      changePassword,
      password,
      passwordRetype,
      roles,
      showAdvancedOptions,
      redirect,
      isLoading,
      error,
      errors,
      showSuccessMessage,
      successMessage,
    } = this.state;

    const getAdvancedOptionsText =
      showAdvancedOptions === false
        ? "Show Advanced Options"
        : "Hide Advanced Options";

    if (redirect) return <Redirect to={redirect} />;

    if (showSuccessMessage) return <SuccessMessage action={successMessage} />;

    if (errors.httpRequestHasError)
      return <ErrorLoadingData message={errors.httpRequest} />;

    if (isLoading) return <LoadingData />;

    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          {error && (
            <span style={globalError}>{errors.globalErrorMessage}</span>
          )}
          <form>
            <fieldset>
              <legend>Demographic Info</legend>
              <TextField
                error={errors.personGivenNameHasError}
                helperText={
                  errors.personGivenNameHasError && errors.personGivenName
                }
                label="Given"
                type="text"
                id="givenName"
                name="givenName"
                onChange={(e) => userPersonChangeHandler(e)}
                value={GET_VALUE(user.person.givenName)}
                required
              />

              <TextField
                label="Middle"
                type="text"
                id="middleName"
                name="middleName"
                onChange={(e) => userPersonChangeHandler(e)}
                value={GET_VALUE(user.person.middleName)}
              />

              <TextField
                error={errors.personFamilyNameHasError}
                helperText={
                  errors.personFamilyNameHasError && errors.personFamilyName
                }
                label="Family Name"
                type="text"
                id="familyName"
                name="familyName"
                onChange={(e) => userPersonChangeHandler(e)}
                value={GET_VALUE(user.person.familyName)}
                required
              />

              <FormControl error={errors.personGenderHasError} required>
                <FormLabel id="demo-radio-buttons-group-label">
                  Gender
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="gender"
                  row
                  value={user.person.gender}
                  onChange={(e) => userPersonChangeHandler(e)}
                >
                  <FormControlLabel
                    control={<Radio />}
                    label="Male"
                    id="male"
                    type="radio"
                    name="gender"
                    value="M"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="Female"
                    id="female"
                    type="radio"
                    name="gender"
                    value="F"
                  />
                </RadioGroup>
                <FormHelperText>
                  {errors.personGenderHasError && errors.personGender}
                </FormHelperText>
              </FormControl>
            </fieldset>

            {/* <fieldset>
              <legend>Provider Account</legend>
              <input
                type="checkbox"
                id="providerAccount"
                name="providerAccount"
                checked={user.providerAccount}
                onChange={(e) => providerAccountChangeHandler(e)}
              />
              <label htmlFor="providerAccount">
                {" "}
                Create a Provider account for this user
              </label>
            </fieldset>
            <hr /> */}

            <fieldset>
              <legend>Login Info</legend>
              <div>
                <span>System Id: </span>{" "}
                {userId === "add" ? (
                  <span style={inputInfoStyle}>
                    System Id will be generated after saving
                  </span>
                ) : (
                  <span>{user.systemId}</span>
                )}
              </div>

              <TextField
                error={errors.usernameHasError}
                helperText={errors.usernameHasError && errors.username}
                label="Username"
                type="text"
                id="username"
                name="username"
                onChange={(e) => userChangeHandler(e)}
                value={GET_VALUE(user.username)}
                required
              />

              <span style={inputInfoStyle}>
                user can log in with either Username or System-Id
              </span>

              <FormControlLabel
                control={
                  <Checkbox
                    id="changePassword"
                    name="changePassword"
                    onChange={(e) => stateChangeHandler(e, "checked")}
                    checked={GET_VALUE(changePassword)}
                  />
                }
                label={<span style={checkboxLabelStyle}>Change Password</span>}
              />

              {changePassword && (
                <div>
                  <TextField
                    error={errors.statePasswordHasError}
                    helperText={
                      errors.statePasswordHasError && errors.statePassword
                    }
                    label="User's Password"
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => stateChangeHandler(e)}
                    value={GET_VALUE(password)}
                    required
                  />
                  <span style={inputInfoStyle}>
                    Password should be atleast 8 characters long and should have
                    atleast one upper case letter, one lower case letter and at
                    least one digit
                  </span>

                  <TextField
                    error={errors.statePasswordRetypeHasError}
                    helperText={
                      errors.statePasswordRetypeHasError &&
                      errors.statePasswordRetype
                    }
                    label="Confirm Password"
                    type="password"
                    id="passwordRetype"
                    name="passwordRetype"
                    onChange={(e) => stateChangeHandler(e)}
                    value={GET_VALUE(passwordRetype)}
                    required
                  />
                  <span style={inputInfoStyle}>
                    Retype the password (for accuracy). It should match the
                    password entered above
                  </span>
                  <br />
                </div>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    type="checkbox"
                    id="forcePasswordChange"
                    name="forcePasswordChange"
                    checked={user.forcePasswordChange}
                    onChange={(e) => userChangeHandler(e, "checked")}
                  />
                }
                label={
                  <span style={checkboxLabelStyle}>Force Password Change</span>
                }
              />
              <span style={inputInfoStyle}>
                Optionally require that this user change their password on next
                login
              </span>

              <div>
                <span style={checkboxGroupHeading}>Roles: </span>
                <span>
                  {/* <ul>
                    {roles.map((el, index) => (
                      <div key={el.role}>
                        <input
                          type="checkbox"
                          name={el.role}
                          checked={el.checked}
                          id={el.role}
                          onChange={(e) => userRoleChangeHandler(e, index)}
                        />{" "}
                        <label htmlFor={el.role}>{el.role}</label>
                      </div>
                    ))}
                  </ul> */}
                  <Grid container>
                    {roles.map((el, index) => (
                      <Grid key={el.role} item md={4} xs={12} sm={6}>
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                label="entry"
                                type="checkbox"
                                name={el.role}
                                checked={el.checked}
                                id={el.role}
                                onChange={(e) =>
                                  userRoleChangeHandler(e, index)
                                }
                              />
                            }
                            label={
                              <span style={checkboxLabelStyle}>{el.role}</span>
                            }
                          />
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </span>
              </div>

              <Button
                variant="outlined"
                type="button"
                onClick={() => toggleAdvancedOptions()}
              >
                {getAdvancedOptionsText}
              </Button>
            </fieldset>

            {showAdvancedOptions && (
              <div>
                <div>
                  <TextField
                    label="Secret Question"
                    type="text"
                    id="secretQuestion"
                    name="secretQuestion"
                    onChange={(e) => userChangeHandler(e)}
                    value={GET_VALUE(user.secretQuestion)}
                  />
                </div>
                <div>
                  <TextField
                    label="Secret Answer"
                    type="text"
                    id="secretAnswer"
                    name="secretAnswer"
                    onChange={(e) => userChangeHandler(e)}
                    value={GET_VALUE(user.secretAnswer)}
                  />
                </div>

                {userId !== "add" && (
                  <div>
                    <div>
                      <span>UUID: </span>
                      <span>{user.uuid}</span>
                    </div>
                    <div>
                      <span style={checkboxGroupHeading}>User Properties</span>
                      <span>
                        {/* <div>
                      <span>Name </span>
                      <span>Value</span>
                    </div> */}
                        {user.userProperty.map((uProperty, index) => (
                          <div key={index}>
                            <TextField
                              label={uProperty.property}
                              type="text"
                              id={uProperty.property}
                              name={uProperty.property}
                              onChange={(e) =>
                                userPropertyChangeHandler(e, index)
                              }
                              value={GET_VALUE(uProperty.propertyValue)}
                            />
                          </div>
                        ))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {userId !== "add" && (
              <fieldset>
                <legend>Creation Info</legend>
                <div>
                  <span>Created By: </span>
                  <span>{user.createdBy}</span>
                </div>
                <div>
                  <span>Date Created: </span>
                  <span>{user.dateCreated}</span>
                </div>
              </fieldset>
            )}

            <Controls.SaveButton onClick={() => saveUser()} />
            <Controls.CancelButton onClick={() => cancelUser()} />
          </form>
        </Paper>

        {userId !== "add" && !user.retired && (
          <Paper style={paperStyle}>
            <fieldset>
              <p style={subHeadingStyle}>Disable Account</p>
              <TextField
                error={errors.retireReasonHasError}
                helperText={errors.retireReasonHasError && errors.retireReason}
                label="Reason to disable"
                type="text"
                id="retireReason"
                name="retireReason"
                onChange={(e) => userChangeHandler(e)}
                value={GET_VALUE(user.retireReason)}
                required
              />

              <Button variant="outlined" onClick={() => disableUser()}>
                Disable Account
              </Button>
            </fieldset>
          </Paper>
        )}

        {userId !== "add" && user.retired && (
          <Button variant="outlined" onClick={() => enableUser()}>
            Enable Account
          </Button>
        )}

        {userId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deleteUser()}
          />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(UserForm);
