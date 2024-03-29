import { Link, Redirect, withRouter } from "react-router-dom";
import {
  getRoles,
  getRoleById,
  insertRole,
  updateRoleById,
  getRoleByName,
  deleteRoleById
} from "../../services/roleService";
import { getPrivileges } from "../../services/privilegeService";

import React from "react";

class RoleForm extends React.Component {
  constructor(props) {
    super(props);
    const initialRoleState = {
      role: "",
      description: "",
      uuid: "",
      parentRoles: [],
      childRoles: [],
      rolePrivileges: []
    };

    this.state = {
      role: initialRoleState,
      roleId: this.props.match.params.id,
      redirect: null,
      allRoles: [],
      inheritedRoles: [],
      allPrivileges: [],
      displayChildRoles: [],
      isLoading: true
    };

    this.inheritedRoleChangeHandler = this.inheritedRoleChangeHandler.bind(
      this
    );
    this.privilegeChangeHandler = this.privilegeChangeHandler.bind(this);
    this.getChildRoleUUID = this.getChildRoleUUID.bind(this);
    this.redirectToChildRole = this.redirectToChildRole.bind(this);
  }

  componentDidMount() {
    this.setAllRoles()
      .then(() => this.setAllPrivileges())
      .then(() => this.setRole())
      .then(() => this.setInheritedRoles())
      .then(() => this.disableDisplayPrivileges())
      .then(() => this.enableDisplayPrivileges())
      .then(() => this.setDisplayChildRoles())
      .then(() => this.setState({ isLoading: false }));
  }

  setDisplayChildRoles() {
    return new Promise((resolve, reject) => {
      const { role } = this.state;

      const displayChildRoles = [];
      role.childRoles.forEach((chRole) => {
        getRoleByName(chRole)
          .then((response) => {
            displayChildRoles.push({
              childRole: response.data.role,
              uuid: response.data.uuid
            });
          })
          .catch((e) => console.log(e.message));
      });

      this.setState({ displayChildRoles }, () => {
        resolve("success");
      });
    });
  }

  setInheritedRoles() {
    return new Promise((resolve, reject) => {
      const { allRoles, role } = this.state;
      const inheritedRoles = [];

      allRoles.forEach((el) => {
        if (el !== "Anonymous" && el !== "Authenticated") {
          if (role.parentRoles.includes(el)) {
            inheritedRoles.push({
              role: el,
              checked: true
            });
          } else {
            inheritedRoles.push({
              role: el,
              checked: false
            });
          }
        }
      });

      this.setState({ inheritedRoles }, () => {
        resolve("success");
      });
    });
  }

  setRole() {
    return new Promise((resolve, reject) => {
      const { roleId } = this.state;
      if (roleId !== "add") {
        getRoleById(roleId)
          .then((response) => {
            this.setState({ role: response.data }, () => {
              resolve("success");
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        resolve("success");
      }
    });
  }

  setAllRoles() {
    return new Promise((resolve, reject) => {
      getRoles()
        .then((response) => {
          const allRoles = [];
          Object.keys(response.data).forEach((key) => {
            allRoles.push(response.data[key].role);
          });
          this.setState({ allRoles }, () => {
            resolve("success");
          });
        })
        .catch((e) => reject(e));
    });
  }

  enableDisplayPrivileges() {
    return new Promise((resolve, reject) => {
      const { role } = this.state;

      role.rolePrivileges.forEach((rp, index) => {
        const { allPrivileges } = this.state;
        const apIndex = allPrivileges.findIndex((ap) => ap.privilege === rp);
        allPrivileges[apIndex].checked = true;
        this.setState({ allPrivileges });

        if (index === role.rolePrivileges.length - 1) {
          resolve("success");
        }
      });
    });
  }

  disableDisplayPrivileges() {
    return new Promise((resolve, reject) => {
      const { role, allPrivileges } = this.state;

      const tempAllPrivileges = [...allPrivileges];

      role.parentRoles.forEach((el, index) => {
        getRoleByName(el)
          .then((response) => {
            const parentRolePrivileges = response.data.rolePrivileges;

            parentRolePrivileges.forEach((prPrivilege) => {
              const index = tempAllPrivileges.findIndex(
                (ap) => ap.privilege === prPrivilege
              );
              tempAllPrivileges[index].checked = true;
              tempAllPrivileges[index].disabled = true;
            });
          })
          .catch((e) => console.log(e.message));
      });

      role.rolePrivileges.forEach((rp) => {
        const index = tempAllPrivileges.findIndex((ap) => ap.privilege === rp);
        tempAllPrivileges[index].checked = true;
      });

      this.setState({ allPrivileges: tempAllPrivileges }, () => {
        resolve("success");
      });
    });
  }

  setAllPrivileges() {
    return new Promise((resolve, reject) => {
      getPrivileges()
        .then((response) => {
          const allPrivileges = [];
          Object.keys(response.data).forEach((key) => {
            allPrivileges.push({
              privilege: response.data[key].privilege,
              checked: false,
              disabled: false
            });
          });
          this.setState({ allPrivileges }, () => {
            resolve("success");
          });
        })
        .catch((e) => reject(e));
    });
  }

  privilegeChangeHandler(event, index) {
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

  roleChangeHandler(event) {
    const { role } = this.state;
    role.role = event.target.value;
    this.setState({ role });
  }

  descriptionChangeHandler(event) {
    const { role } = this.state;
    role.description = event.target.value;
    this.setState({ role });
  }

  cancel() {
    this.setState({ redirect: "/role/view/all" });
  }

  deleteRole() {
    const { roleId } = this.state;
    deleteRoleById(roleId)
      .then((res) => {
        this.setState({ redirect: "/role/view/all" });
      })
      .catch((e) => console.log(e.message));
  }

  saveRole() {
    const { roleId, role } = this.state;
    console.log("role", role);
    // if (roleId === "add") {
    //   insertRole(role)
    //     .then(() => {
    //       this.setState({ redirect: "/role/view/all" });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } else {
    //   updateRoleById(roleId, role)
    //     .then(() => {
    //       this.setState({ redirect: "/role/view/all" });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
  }

  getValueFor(field) {
    return field === null ? "" : field;
  }

  getChildRoleUUID(childRole) {
    var uuid = "";

    getRoleByName(childRole)
      .then((response) => {
        uuid = response.data.uuid;
      })
      .catch((e) => console.log(e.message));

    return uuid;
  }

  redirectToChildRole(uuid) {
    // this.setState({ redirect: `/role/view/${uuid}` });
    // console.log("uuid", uuid);
    // this.props.history.push(`/role/view/${uuid}`);
    // this.history.pushState(null, `/role/view/${uuid}`);
  }

  render() {
    const {
      role,
      roleId,
      redirect,
      inheritedRoles,
      allPrivileges,
      isLoading,
      displayChildRoles
    } = this.state;
    const {
      roleChangeHandler,
      descriptionChangeHandler,
      saveRole,
      getValueFor,
      inheritedRoleChangeHandler,
      privilegeChangeHandler,
      cancel,
      deleteRole,
      getChildRoleUUID,
      redirectToChildRole
    } = this;

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <p>loading...</p>;

    return (
      <React.Fragment>
        <div>
          <label htmlFor="role">
            Role :
            <input
              type="text"
              id="role"
              name="role"
              value={getValueFor(role.role)}
              disabled={roleId === "add" ? false : true}
              onChange={roleChangeHandler.bind(this)}
            />
          </label>
          <br />

          <label htmlFor="description">
            Description :
            <textarea
              id="description"
              name="description"
              rows="3"
              cols="20"
              value={getValueFor(role.description)}
              onChange={descriptionChangeHandler.bind(this)}
            />
          </label>
          <br />

          <div>
            <p>Roles that contain (inherit privileges from) {role.role}</p>

            <ul>
              {role.childRoles.map((childRole) => (
                <li key={childRole.uuid}>
                  {/* <Link to={`/role/view/${childRole.uuid}`}>
                    {childRole.childRoleName}
                  </Link> */}
                  <p
                    // to={`/role/view/${childRole.uuid}`}
                    onClick={() => {
                      this.setState({
                        redirect: `/role/edit/${childRole.uuid}`
                      });
                    }}
                    // onClick={redirectToChildRole(childRole.uuid)}
                    // onClick={() => {
                    //   window.location.href = `/role/view/${childRole.uuid}`;
                    // }}
                  >
                    {childRole.childRoleName}
                  </p>
                </li>
              ))}
            </ul>

            {/* {displayChildRoles.map((el) => (
              <div> {el.childRole}</div>
            ))} */}

            <br />
          </div>

          <div>
            <p>Inherited Roles:</p>
            <div>
              <p>{role.role} inherits privileges from these roles</p>
              <ul>
                {inheritedRoles.map((el, index) => (
                  <div key={el.role}>
                    <input
                      type="checkbox"
                      name={el.role}
                      checked={el.checked}
                      id={el.role}
                      onChange={(e) => inheritedRoleChangeHandler(e, index)}
                    />{" "}
                    <label htmlFor={el.role}>{el.role}</label>
                  </div>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p>Privileges:</p>
            <div>
              {/* TO DO */}
              {/* <p>{role.role} inherits privileges from these roles</p> */}
              <ul>
                {allPrivileges.map((el, index) => (
                  <div key={el.privilege}>
                    <input
                      type="checkbox"
                      name={el.privilege}
                      checked={el.checked}
                      disabled={el.disabled}
                      id={el.privilege}
                      onChange={(e) => privilegeChangeHandler(e, index)}
                    />{" "}
                    <label htmlFor={el.privilege}>{el.privilege}</label>
                  </div>
                ))}
              </ul>
            </div>
          </div>

          <br />
          {roleId !== "add" && (
            <div>
              <span>UUID: </span>
              <span>{role.uuid}</span>
            </div>
          )}
          <br />

          <button type="button" onClick={saveRole.bind(this)}>
            Save Role
          </button>
          <button type="button" onClick={cancel.bind(this)}>
            Cancel
          </button>

          {roleId !== "add" && (
            <button type="button" onClick={deleteRole.bind(this)}>
              Delete
            </button>
          )}

          <br />
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(RoleForm);
