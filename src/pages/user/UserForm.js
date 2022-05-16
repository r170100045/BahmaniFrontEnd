import { Redirect, withRouter } from "react-router-dom";

import React from "react";
import { getRoles } from "../../services/roleService";
import { getUserById } from "../../services/userService";

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    const initialUserState = {
      // userId: 1,
      systemId: "",
      username: "",
      secretQuestion: "",
      secretAnswer: "",
      dateCreated: "",
      // dateChanged: null,
      retired: false,
      // dateRetired: null,
      retireReason: "",
      uuid: "",
      createdBy: "",
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
        uuid: "",
        givenName: "",
        middleName: "",
        familyName: "",
        gender: "",
        // concatenatedName: "Super User",
        // personNameUuid: "4ec7e2a4-3f10-11e4-adec-0800271c1b75",
      },
      // personNameUuid: ["4ec7e2a4-3f10-11e4-adec-0800271c1b75"],
      forcePasswordChange: false,
    };

    this.state = {
      user: initialUserState,
      redirect: null,
      userId: this.props.match.params.id,
      personId: this.props.match.params.personId,
      isLoading: true,
      error: false,
      password: "",
      passwordRetype: "",
      roles: [],
      showAdvancedOptions: false,
    };

    this.givenNameChangeHandler = this.givenNameChangeHandler.bind(this);
    this.middleNameChangeHandler = this.middleNameChangeHandler.bind(this);
    this.familyNameChangeHandler = this.familyNameChangeHandler.bind(this);
    this.genderChangeHandler = this.genderChangeHandler.bind(this);
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.userRoleChangeHandler = this.userRoleChangeHandler.bind(this);
    this.retireReasonChangeHandler = this.retireReasonChangeHandler.bind(this);
    this.userPropertyChangeHandler = this.userPropertyChangeHandler.bind(this);
    this.secretQuestionChangeHandler =
      this.secretQuestionChangeHandler.bind(this);
    this.secretAnswerChangeHandler = this.secretAnswerChangeHandler.bind(this);
    this.passwordRetypeChangeHandler =
      this.passwordRetypeChangeHandler.bind(this);
    this.forcePasswordChangeHandler =
      this.forcePasswordChangeHandler.bind(this);
    // this.providerAccountChangeHandler =
    //   this.providerAccountChangeHandler.bind(this);
  }

  componentDidMount() {
    const { userId, personId } = this.state;

    this.setUser(userId, personId)
      // .then(() => this.setPerson(personId))
      .then(() => this.setRoles())
      .then(() => this.setUserRoles())
      .then(() => this.setState({ isLoading: false }));
  }

  setPerson(personId) {}

  setUserRoles() {
    return new Promise((resolve, reject) => {
      const { roles, user } = this.state;
      const tempRoles = [...roles];
      user.userRoles.forEach((uRole) => {
        const idx = tempRoles.findIndex((role) => role.role === uRole);
        tempRoles[idx].checked = true;
      });
      this.setState({ roles: tempRoles }, () => resolve("success"));
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
          this.setState({ roles }, () => {
            resolve("success");
          });
        })
        .catch((e) => reject(e));
    });
  }

  setUser(userId, personId) {
    return new Promise((resolve, reject) => {
      if (userId === "add") {
        if (personId !== "dummy") {
          // TO-DO get person info, set it in user and resolve
          resolve();
        } else {
          resolve();
        }
      } else {
        getUserById(userId)
          .then((response) => {
            this.setState({ user: response.data }, () => {
              resolve("success");
            });
          })
          .catch((e) => reject(e));
      }
    });
  }

  getValueFor(field) {
    return field === null ? "" : field;
  }

  unretireUser() {
    const { user, userId } = this.state;
    user.retired = false;
    this.setState(
      { user }
      //    () => {
      //   putDrugById(userId, user)
      //     .then(() => {
      //       this.setState({ redirect: "/user/view/all" });
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
    );
  }

  nameChangeHandler(event) {
    const { drug } = this.state;
    drug.name = event.target.value;
    this.setState({ drug });
  }

  saveUser() {
    const { user, userId, password } = this.state;
    user.password = password;
    console.log("user", user);
    // if (drug.name === "" || drug.conceptId === "" passwordValidation) {
    //   this.setState({ error: true });
    // }
    // else {
    //   if (drugId === "add") {
    //     postDrug(drug)
    //       .then(() => {
    //         this.setState({ redirect: "/drug/all" });
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   } else {
    //     putDrugById(drugId, drug)
    //       .then(() => {
    //         this.setState({ redirect: "/drug/all" });
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   }
    // }
  }

  cancelButtonHandler() {
    this.setState({ redirect: "/user/view/all/dummy" });
  }

  retireUser() {
    let { user, userId } = this.state;
    user.retired = true;
    this.setState(
      { user }
      //   () => {
      //   putDrugById(userId, user)
      //     .then(() => {})
      //     .catch((error) => {
      //       console.log(error);
      //     });

      //   this.setState({ redirect: "/user/view/all" });
      // }
    );
  }

  deleteUser() {
    let { userId } = this.state;
    // deleteDrugById(userId)
    //   .then(() => {
    //     this.setState({ redirect: "/user/view/all" });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  toggleAdvancedOptions() {
    const { showAdvancedOptions } = this.state;
    this.setState({ showAdvancedOptions: !showAdvancedOptions });
  }

  givenNameChangeHandler(event) {
    const { user } = this.state;
    user.person.givenName = event.target.value;
    this.setState({ user });
  }

  middleNameChangeHandler(event) {
    const { user } = this.state;
    user.person.middleName = event.target.value;
    this.setState({ user });
  }

  familyNameChangeHandler(event) {
    const { user } = this.state;
    user.person.familyName = event.target.value;
    this.setState({ user });
  }

  genderChangeHandler(event) {
    const { user } = this.state;
    user.person.gender = event.currentTarget.value;
    this.setState({ user });
  }

  usernameChangeHandler(event) {
    const { user } = this.state;
    user.username = event.target.value;
    this.setState({ user });
  }

  secretQuestionChangeHandler(event) {
    const { user } = this.state;
    user.secretQuestion = event.target.value;
    this.setState({ user });
  }

  secretAnswerChangeHandler(event) {
    const { user } = this.state;
    user.secretAnswer = event.target.value;
    this.setState({ user });
  }

  retireReasonChangeHandler(event) {
    const { user } = this.state;
    user.retireReason = event.target.value;
    this.setState({ user });
  }

  passwordChangeHandler(event) {
    this.setState({ password: event.target.value });
  }

  passwordRetypeChangeHandler(event) {
    this.setState({ passwordRetype: event.target.value });
  }

  forcePasswordChangeHandler(event) {
    const { user } = this.state;
    user.forcePasswordChange = event.target.checked;
    this.setState({ user });
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

  // providerAccountChangeHandler(event) {
  //   const { user } = this.state;
  //   user.person.providerAccount = event.target.checked;
  //   this.setState({ user });
  // }

  render() {
    const {
      retireReasonChangeHandler,
      cancelButtonHandler,
      retireUser,
      deleteUser,
      saveUser,
      getValueFor,
      unretireUser,
      toggleAdvancedOptions,
      givenNameChangeHandler,
      middleNameChangeHandler,
      familyNameChangeHandler,
      genderChangeHandler,
      usernameChangeHandler,
      passwordChangeHandler,
      passwordRetypeChangeHandler,
      forcePasswordChangeHandler,
      userRoleChangeHandler,
      secretQuestionChangeHandler,
      secretAnswerChangeHandler,
      userPropertyChangeHandler,
      // providerAccountChangeHandler,
    } = this;

    const {
      user,
      redirect,
      userId,
      isLoading,
      roles,
      error,
      password,
      passwordRetype,
      showAdvancedOptions,
    } = this.state;

    const getAdvancedOptionsText =
      showAdvancedOptions === false
        ? "Show Advanced Options"
        : "Hide Advanced Options";

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    if (!isLoading || userId === "add") {
      return (
        <React.Fragment>
          {error && <p>Fill the required fields</p>}
          <p>User Management</p>

          {user.retired && (
            <span>
              This user account is disabled and the user cannot log in.
            </span>
          )}

          <form>
            <hr />
            <fieldset>
              <legend>Demographic Info</legend>
              <label htmlFor="given">Given*: </label>
              <input
                type="text"
                id="given"
                name="given"
                onChange={(e) => givenNameChangeHandler(e)}
                value={getValueFor(user.person.givenName)}
              />
              <br />

              <label htmlFor="given">Middle: </label>
              <input
                type="text"
                id="middle"
                name="middle"
                onChange={(e) => middleNameChangeHandler(e)}
                value={getValueFor(user.person.middleName)}
              />
              <br />

              <label htmlFor="given">Family Name*: </label>
              <input
                type="text"
                id="familyName"
                name="familyName"
                onChange={(e) => familyNameChangeHandler(e)}
                value={getValueFor(user.person.familyName)}
              />
              <br />

              <span>
                Gender*:{" "}
                <input
                  id="male"
                  type="radio"
                  name="gender"
                  value="M"
                  checked={user.person.gender === "M" ? true : false}
                  onChange={(e) => genderChangeHandler(e)}
                />
                <label htmlFor="male">Male</label>
                <input
                  id="female"
                  type="radio"
                  name="gender"
                  value="F"
                  checked={user.person.gender === "F" ? true : false}
                  onChange={(e) => genderChangeHandler(e)}
                />
                <label htmlFor="female">Female</label>
              </span>
              <br />
            </fieldset>

            <hr />

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
                  <span>System Id will be generated after saving</span>
                ) : (
                  <span>{user.systemId}</span>
                )}
              </div>
              <br />

              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={(e) => usernameChangeHandler(e)}
                value={getValueFor(user.username)}
              />
              <span>User can log in with either Username or System Id</span>
              <br />
              <label htmlFor="password">User's Password: </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => passwordChangeHandler(e)}
                value={getValueFor(password)}
              />
              <span>
                Password should be 8 characters long and should have both upper
                and lower case characters , at least one digit , at least one
                non digit
              </span>
              <br />
              <label htmlFor="passwordRetype">Confirm Password: </label>
              <input
                type="password"
                id="passwordRetype"
                name="passwordRetype"
                onChange={(e) => passwordRetypeChangeHandler(e)}
                value={getValueFor(passwordRetype)}
              />
              <span>
                Retype the password (for accuracy). It should match the password
                entered above
              </span>
              <br />
              <label htmlFor="forcePasswordChange">
                Force Password Change{" "}
              </label>
              <input
                type="checkbox"
                id="forcePasswordChange"
                name="forcePasswordChange"
                checked={user.forcePasswordChange}
                onChange={(e) => forcePasswordChangeHandler(e)}
              />
              <br />

              <div>
                <span>Roles: </span>
                <span>
                  <ul>
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
                  </ul>
                </span>
              </div>

              <button type="button" onClick={toggleAdvancedOptions.bind(this)}>
                {getAdvancedOptionsText}
              </button>
            </fieldset>

            {showAdvancedOptions && (
              <div>
                <div>
                  <span>
                    <label htmlFor="secretQuestion">Secret Question: </label>
                    <input
                      type="text"
                      id="secretQuestion"
                      name="secretQuestion"
                      onChange={(e) => secretQuestionChangeHandler(e)}
                      value={getValueFor(user.secretQuestion)}
                    />
                  </span>
                  <span>Optional</span>
                </div>
                <div>
                  <span>
                    <label htmlFor="secretAnswer">Secret Answer: </label>
                    <input
                      type="text"
                      id="secretAnswer"
                      name="secretAnswer"
                      onChange={(e) => secretAnswerChangeHandler(e)}
                      value={getValueFor(user.secretAnswer)}
                    />
                  </span>
                  <span>Optional</span>
                </div>
                <div>
                  <span>UUID: </span>
                  <span>{user.uuid}</span>
                </div>
                <div>
                  <span>User Properties</span>
                  <span>
                    <div>
                      <span>Name </span>
                      <span>Value</span>
                    </div>
                    {user.userProperty.map((uProperty, index) => (
                      <div key={index}>
                        <span>
                          <label htmlFor={uProperty.property}>
                            {uProperty.property}
                          </label>
                          <input
                            type="text"
                            id={uProperty.property}
                            name={uProperty.property}
                            onChange={(e) =>
                              userPropertyChangeHandler(e, index)
                            }
                            value={getValueFor(uProperty.propertyValue)}
                          />
                        </span>
                      </div>
                    ))}
                  </span>
                </div>
              </div>
            )}

            {userId !== "add" && (
              <fieldset>
                <legend>Creation Info</legend>
                <div>
                  <span>Created By</span>
                  <span>{user.createdBy}</span>
                </div>
                <div>
                  <span>Date Created </span>
                  <span>{user.dateCreated}</span>
                </div>
              </fieldset>
            )}

            <button type="button" onClick={saveUser.bind(this)}>
              Save
            </button>
            <button type="button" onClick={cancelButtonHandler.bind(this)}>
              Cancel
            </button>
            {userId !== "add" && (
              <button type="button" onClick={deleteUser.bind(this)}>
                Delete
              </button>
            )}
          </form>
          <hr />

          {userId !== "add" && !user.retired && (
            <fieldset>
              <p>Disable Account</p>
              <label htmlFor="retireReason">Reason:*</label>
              <input
                type="text"
                id="retireReason"
                name="retireReason"
                onChange={(e) => retireReasonChangeHandler(e)}
                value={getValueFor(user.retireReason)}
              />
              <br />
              <button type="button" onClick={retireUser.bind(this)}>
                Disable Account
              </button>
            </fieldset>
          )}

          {userId !== "add" && user.retired && (
            <button type="button" onClick={unretireUser.bind(this)}>
              Enable Account
            </button>
          )}
        </React.Fragment>
      );
    }

    return <p>Loading...</p>;
  }
}

export default withRouter(UserForm);
