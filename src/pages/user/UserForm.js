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
  buttonGroupStyle,
  checkboxGroupHeading,
  checkboxLabelStyle,
  deleteButtonStyle,
  globalError,
  groupHeading,
  inputError,
  inputInfoStyle,
  inputStyle,
  paperStyle,
  propertyName,
  subHeadingStyle,
  userBioData,
} from "../../constants/formStyling";
import {
  getPersonById,
  getUserById,
  insertPerson,
  insertUser,
  updatePersonById,
  updateUserById,
} from "../../services/userService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import RetireButton from "../../components/controls/buttons/RetireButton";
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
        const { errors, changePassword, password, passwordRetype, userId } =
          this.state;
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

        if (changePassword || userId === "add") {
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
                personNameUuid: null,
              };

              personObj.uuid = response.data.uuid;
              personObj.givenName = response.data.givenName;
              personObj.middleName = response.data.middleName;
              personObj.familyName = response.data.familyName;
              personObj.gender = response.data.gender;
              personObj.personNameUuid = response.data.personNameUuid;

              const { user } = this.state;
              user.person = personObj;
              this.setState({ user }, () => {
                resolve();
              });
            })
            .catch((error) => {
              console.log(error);
              this.setHttpError("getPersonById", error.message);
            });
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
          .catch((error) => {
            console.log(error);
            this.setHttpError("getUserById", error.message);
          });
      }
    });
  }

  setRoles() {
    return new Promise((resolve, reject) => {
      getRoles()
        .then((response) => {
          const roles = [];
          Object.keys(response.data).forEach((key) => {
            roles.push({
              role: response.data[key].role,
              checked: false,
            });
          });
          this.setState({ roles }, () => resolve());
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getRoles", error.message);
        });
    });
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
  saveUser(successMessage = "Updated") {
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

  savePerson(user) {
    return new Promise((resolve, reject) => {
      const { personId, userId } = this.state;
      const { person } = user;

      if (userId === "add" && personId === "dummy") {
        const personForPostRequest = {
          gender: person.gender,
          personNames: [
            {
              givenName: person.givenName,
              middleName: person.middleName,
              familyName: person.familyName,
            },
          ],
        };

        insertPerson(personForPostRequest)
          .then((resp) => {
            getPersonById(resp.data.uuid)
              .then((response) => {
                const personId = {
                  uuid: response.data.uuid,
                  gender: response.data.gender,
                  personNames: [
                    {
                      uuid: response.data.personNameUuid,
                      givenName: response.data.givenName,
                      middleName: response.data.middleName,
                      familyName: response.data.familyName,
                    },
                  ],
                };
                user.personId = personId;
                this.setState({ user }, () => resolve());
              })
              .catch((error) => {
                console.log(error);
                this.setHttpError("getPersonById", error.message);
              });
          })
          .catch((error) => {
            console.log(error);
            this.setHttpError("insertPerson", error.message);
          });
      }
      // if (userId !== "add" || personId !== "dummy") {
      else {
        const personForPutRequest = {
          gender: person.gender,
          personNames: [
            {
              uuid: person.personNameUuid,
              givenName: person.givenName,
              middleName: person.middleName,
              familyName: person.familyName,
            },
          ],
        };

        updatePersonById(person.uuid, personForPutRequest)
          .then(() => {
            const personId = {
              uuid: person.uuid,
              // gender: person.gender,
              personNames: [
                {
                  uuid: person.personNameUuid,
                  // givenName: person.givenName,
                  // middleName: person.middleName,
                  // familyName: person.familyName,
                },
              ],
            };
            user.personId = personId;
            this.setState({ user }, () => resolve());
          })
          .catch((error) => {
            console.log(error);
            this.setHttpError("updatePersonById", error.message);
          });
      }
    });
  }

  insertUserWithData(user) {
    this.savePerson(user).then(() => {
      const { user: userModified } = this.state;
      console.log("userModified", userModified);

      insertUser(userModified)
        .then(() => {
          this.successAndRedirect("Saved");
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("insertUser", error.message);
        });
    });
  }

  updateUserWithData(userId, user, successMessage) {
    this.savePerson(user).then(() => {
      const { user: userModified } = this.state;
      console.log("userModified", userModified);

      updateUserById(userId, userModified)
        .then(() => {
          this.successAndRedirect(successMessage);
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("updateUserById", error.message);
        });
    });
  }
  // save ends

  disableUser() {
    const { user } = this.state;
    user.retired = true;
    this.setState({ user }, () => {
      this.saveUser("Disabled");
    });
  }

  enableUser() {
    const { user } = this.state;
    user.retireReason = null;
    user.retired = false;
    this.setState({ user }, () => {
      this.saveUser("Enabled");
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
    //     this.successAndRedirect("Deleted");
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

    console.log("user", user);
    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          {error && (
            <span style={globalError}>{errors.globalErrorMessage}</span>
          )}
          <form>
            <div>
              <div style={groupHeading}>Demographic Info</div>
              <div style={userBioData}>
                <TextField
                  style={inputStyle}
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
                  style={inputStyle}
                  label="Middle"
                  type="text"
                  id="middleName"
                  name="middleName"
                  onChange={(e) => userPersonChangeHandler(e)}
                  value={GET_VALUE(user.person.middleName)}
                />

                <TextField
                  style={inputStyle}
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
                <FormControl
                  error={errors.personGenderHasError}
                  required
                  style={{ marginTop: "16px" }}
                >
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
              </div>
            </div>

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

            <div style={groupHeading}>Login Info</div>
            <div style={userBioData}>
              <span>
                <span style={propertyName}>System Id: </span>{" "}
                {userId === "add" ? (
                  <span style={inputInfoStyle}>
                    System Id will be generated after saving
                  </span>
                ) : (
                  <span>{user.systemId}</span>
                )}
              </span>

              <TextField
                style={inputStyle}
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
              {userId !== "add" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      id="changePassword"
                      name="changePassword"
                      onChange={(e) => stateChangeHandler(e, "checked")}
                      checked={GET_VALUE(changePassword)}
                    />
                  }
                  label={
                    <span style={checkboxLabelStyle}>Change Password</span>
                  }
                />
              )}

              {(changePassword || userId === "add") && (
                <div>
                  <TextField
                    style={inputStyle}
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
                  <div>
                    <span style={inputInfoStyle}>
                      Password should be atleast 8 characters long and should
                      have atleast one upper case letter, one lower case letter
                      and at least one digit
                    </span>
                  </div>

                  <TextField
                    style={inputStyle}
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
                  <div>
                    <span style={inputInfoStyle}>
                      Retype the password (for accuracy). It should match the
                      password entered above
                    </span>
                  </div>
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
                  <span style={checkboxLabelStyle}>
                    Force Password Change{" "}
                    <span style={inputInfoStyle}>
                      (Optionally require that this user change their password
                      on next login)
                    </span>
                  </span>
                }
              />
            </div>
            <div>
              <span style={groupHeading}>Roles: </span>
              <div style={{ marginLeft: 20 }}>
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
                              onChange={(e) => userRoleChangeHandler(e, index)}
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
              </div>
            </div>
            <Button
              style={{ marginBottom: 10 }}
              variant="outlined"
              type="button"
              onClick={() => toggleAdvancedOptions()}
              size="small"
            >
              {getAdvancedOptionsText}
            </Button>

            {showAdvancedOptions && (
              <div style={{ marginLeft: 20 }}>
                <div>
                  <TextField
                    style={inputStyle}
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
                    style={inputStyle}
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
                      <span style={propertyName}>UUID: </span>
                      <span style={inputInfoStyle}>{user.uuid}</span>
                    </div>

                    {user.userProperty.length > 0 && (
                      <div>
                        <span style={groupHeading}>User Properties</span>
                        <div style={{ marginLeft: 20 }}>
                          {user.userProperty.map((uProperty, index) => (
                            <div key={index}>
                              <TextField
                                style={inputStyle}
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
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {userId !== "add" && (
              <div>
                <div style={groupHeading}>Creation Info</div>
                <div style={{ marginLeft: 20, marginBottom: 10 }}>
                  <div>
                    <span style={propertyName}>Created By: </span>
                    <span style={inputInfoStyle}>{user.createdBy}</span>
                  </div>
                  <div>
                    <span style={propertyName}>Date Created: </span>
                    <span style={inputInfoStyle}>{user.dateCreated}</span>
                  </div>
                </div>
              </div>
            )}

            <Grid container style={{ gridGap: 5 }}>
              <Controls.SaveButton onClick={() => saveUser()} />
              <Controls.CancelButton onClick={() => cancelUser()} />
            </Grid>
          </form>
        </Paper>

        {userId !== "add" && !user.retired && (
          <Paper style={paperStyle}>
            <TextField
              error={errors.retireReasonHasError}
              helperText={errors.retireReasonHasError && errors.retireReason}
              style={inputStyle}
              label="Reason to Disable"
              type="text"
              id="retireReason"
              name="retireReason"
              multiline
              value={GET_VALUE(user.retireReason)}
              onChange={(e) => userChangeHandler(e)}
              required
            />

            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                disabled={user.retired}
                onClick={() => disableUser()}
              />
            </div>
          </Paper>
        )}

        {userId !== "add" && user.retired && (
          <Paper style={paperStyle}>
            <p style={subHeadingStyle}>Enable User</p>
            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                disabled={user.retired}
                onClick={() => enableUser()}
              />
            </div>
          </Paper>
        )}

        {/* {userId !== "add" && !user.retired && (
          <Paper style={paperStyle}>
            <div>
              <p style={subHeadingStyle}>Disable Account</p>
              <div>
                <TextField
                  error={errors.retireReasonHasError}
                  helperText={
                    errors.retireReasonHasError && errors.retireReason
                  }
                  label="Reason to disable"
                  type="text"
                  id="retireReason"
                  name="retireReason"
                  onChange={(e) => userChangeHandler(e)}
                  value={GET_VALUE(user.retireReason)}
                  required
                />
              </div>
            </div>
          </Paper>
        )}

        {userId !== "add" && user.retired && (
          <Button variant="outlined" onClick={() => enableUser()}>
            Enable Account
          </Button>
        )} */}

        {/* {userId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deleteUser()}
          />
        )} */}
      </React.Fragment>
    );
  }
}

export default withRouter(UserForm);
