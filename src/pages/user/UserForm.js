import { Redirect, withRouter } from "react-router-dom";
import {
  deleteDrugById,
  getUser,
  postDrug,
  putDrugById,
} from "../../api/services";

import React from "react";
import { getRoles } from "@testing-library/react";

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    const initialUserState = {
      systemId: "",
      username: "",
      password: "",
      salt: "",
      secretQuestion: "",
      secretAnswer: "",
      retired: false,
      retireReason: null,
      userProperty: [],
      userRoles: [],
    };

    this.state = {
      user: initialUserState,
      redirect: null,
      userId: this.props.match.params.id,
      isLoading: true,
      error: false,
      passwordRetype: "",
      roles: [],
      showAdvancedOptions: false,
    };
  }

  componentDidMount() {
    const { userId } = this.state;

    this.setUser(userId)
      .then(() => this.setRoles())
      .then(() => this.setState({ isLoading: false }));
  }

  setRoles() {
    return new Promise((resolve, reject) => {
      getRoles()
        .then((response) => {
          this.setState({ roles: response.data }, () => {
            resolve("success");
          });
        })
        .catch((e) => reject(e));
    });
  }

  setUser(userId) {
    return new Promise((resolve, reject) => {
      if (userId !== "add") {
        getUser()
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
      //       this.setState({ redirect: "/user/all" });
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

  retireReasonChangeHandler(event) {
    const { user } = this.state;
    user.retireReason = event.target.value;
    this.setState({ user });
  }

  submitUserFormHandler() {
    const { user, userId } = this.state;
    // if (drug.name === "" || drug.conceptId === "")
    //   this.setState({ error: true });
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
    this.setState({ redirect: "/user/all" });
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

      //   this.setState({ redirect: "/user/all" });
      // }
    );
  }

  deleteUser() {
    let { userId } = this.state;
    // deleteDrugById(userId)
    //   .then(() => {
    //     this.setState({ redirect: "/user/all" });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  getCheckedForRole(role) {
    const { userRoles } = this.state.user;
    userRoles.forEach((userRole) => {
      if (userRole === role) {
        return true;
      }
    });
    return false;
  }

  toggleAdvancedOptions() {
    const { showAdvancedOptions } = this.state;
    this.setState({ showAdvancedOptions: !showAdvancedOptions });
  }

  render() {
    const {
      retireReasonChangeHandler,
      cancelButtonHandler,
      retireUser,
      deleteUser,
      getValueFor,
      unretireUser,
      getCheckedForRole,
      toggleAdvancedOptions,
    } = this;

    const {
      user,
      redirect,
      userId,
      isLoading,
      roles,
      error,
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
            <p>
              This user is disabled by ... ... - {user.retireReason}{" "}
              <button type="button" onClick={unretireUser.bind(this)}>
                Enable this user
              </button>
            </p>
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
                // onChange={givenChangeHandler.bind(this)}
                // value={getValueFor(drug.given)}
              />
              <br />

              <label htmlFor="given">Middle: </label>
              <input
                type="text"
                id="middle"
                name="middle"
                // onChange={middleChangeHandler.bind(this)}
                // value={getValueFor(drug.middle)}
              />
              <br />

              <label htmlFor="given">Family Name*: </label>
              <input
                type="text"
                id="familyName"
                name="familyName"
                // onChange={familyNameChangeHandler.bind(this)}
                // value={getValueFor(drug.familyName)}
              />
              <br />

              <span>
                Gender*:{" "}
                <input type="radio" id="male" name="gender" value="male" />
                <label for="male">Male</label>
                <input type="radio" id="female" name="gender" value="female" />
                <label for="female">Female</label>
              </span>
              <br />
            </fieldset>

            <hr />

            <fieldset>
              <legend>Provider Account</legend>
              <input
                type="checkbox"
                id="providerAccount"
                name="providerAccount"
                value="providerAccount"
                checked="true"
              />
              <label for="providerAccount">
                {" "}
                Create a Provider account for this user
              </label>
            </fieldset>

            <hr />

            <fieldset>
              <legend>Login Info</legend>
              System Id (System Id will be generated after saving)
              <label htmlFor="systemId">System Id</label>
              {userId === "add" ? (
                <span>System Id</span>
              ) : (
                <input
                  type="text"
                  id="systemId"
                  name="systemId"
                  disabled="true"
                  value={user.systemId}
                />
              )}
              <br />
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="username"
                name="username"
                // onChange={usernameChangeHandler.bind(this)}
                value={getValueFor(user.username)}
              />
              <span>User can log in with either Username or System Id</span>
              <br />
              <label htmlFor="password">User's Password: </label>
              <input
                type="password"
                id="password"
                name="password"
                // onChange={passwordChangeHandler.bind(this)}
                value={getValueFor(user.password)}
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
                // onChange={passwordRetypeChangeHandler.bind(this)}
                value={getValueFor(passwordRetype)}
              />
              <span>Retype the password (for accuracy)</span>
              <br />
              <label for="forcePasswordChange">Force Password Change </label>
              <input
                type="checkbox"
                id="forcePasswordChange"
                name="forcePasswordChange"
                value="forcePasswordChange"
                checked="true"
              />
              <br />
              <span>Roles</span>
              {roles.map((role) => (
                <div>
                  <input
                    type="checkbox"
                    id="forcePasswordChange"
                    name="forcePasswordChange"
                    value="forcePasswordChange"
                    checked={getCheckedForRole(role.role)}
                  />
                  <label>{role.role}</label>
                </div>
              ))}
              <br />
              <button type="button" onClick={toggleAdvancedOptions.bind(this)}>
                {getAdvancedOptionsText}
              </button>
            </fieldset>

            <fieldset>
              <legend>Creation Info</legend>
              <div>
                <div>Created By</div>
                <div>fill in the user who created</div>
              </div>
              <div>
                <div>Date Created </div>
                <div>fill in the date created</div>
              </div>
            </fieldset>

            <button
              type="button"
              // onClick={submitUserFormHandler.bind(this)}
            >
              Save User
            </button>
            <button type="button" onClick={cancelButtonHandler.bind(this)}>
              Cancel
            </button>
            {userId !== "add" && (
              <button type="button" onClick={deleteUser.bind(this)}>
                Delete User
              </button>
            )}
          </form>
          <hr />

          {userId !== "add" && (
            <fieldset>
              <p>Disable Account</p>
              <label htmlFor="retireReason">Reason: </label>
              <input
                type="text"
                id="retireReason"
                name="retireReason"
                onChange={retireReasonChangeHandler.bind(this)}
                value={getValueFor(user.retireReason)}
              />
              <br />
              <button type="button" onClick={retireUser.bind(this)}>
                Disable Account
              </button>
            </fieldset>
          )}
        </React.Fragment>
      );
    }

    return <p>Loading...</p>;
  }
}

export default withRouter(UserForm);
