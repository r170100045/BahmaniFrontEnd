import { Redirect, withRouter } from "react-router-dom";
import {
  deleteRoleById,
  getRoleById,
  getRoleByName,
  getRoles,
  insertRole,
  updateRoleById,
} from "../../services/roleService";

import React from "react";
import { getPrivileges } from "../../services/privilegeService";

class RoleForm extends React.Component {
  constructor(props) {
    super(props);
    const initialRoleState = {
      role: "",
      description: "",
      uuid: "",
      parentRoles: [],
      childRoles: [],
      rolePrivileges: [],
    };

    this.state = {
      role: initialRoleState,
      roleId: this.props.match.params.id,
      redirect: null,
      allRoles: [],
      inheritedRoles: [],
      allPrivileges: [],
      isLoading: true,
    };

    this.inheritedRoleChangeHandler =
      this.inheritedRoleChangeHandler.bind(this);
    this.privilegeChangeHandler = this.privilegeChangeHandler.bind(this);
  }

  componentDidMount() {
    this.setAllRoles()
      .then(() => this.setAllPrivileges())
      .then(() => this.setRole())
      .then(() => this.setInheritedRoles())
      .then(() => this.setCurrentPrivileges())
      .then(() => this.disableDisplayPrivileges())
      .then(() => this.setState({ isLoading: false }));
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
          .catch((e) => reject(e));
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

  setCurrentPrivileges() {
    return new Promise((resolve, reject) => {
      const { role, allPrivileges } = this.state;
      const tempAllPrivileges = [...allPrivileges];

      role.rolePrivileges.forEach((rp) => {
        const tapIndex = tempAllPrivileges.findIndex(
          (tap) => tap.privilege === rp
        );
        tempAllPrivileges[tapIndex].checked = true;
      });

      this.setState({ allPrivileges: tempAllPrivileges }, () => {
        resolve("success");
      });
    });
  }

  disableDisplayPrivileges() {
    return new Promise((resolve, reject) => {
      const { role, allPrivileges } = this.state;
      const tempAllPrivileges = [...allPrivileges];

      if (role.parentRoles.length === 0) {
        resolve("success");
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
                  resolve("success");
                });
              }
            })
            .catch((e) => console.log(e.message));
        });
      }
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
              disabled: false,
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
    if (roleId === "add") {
      insertRole(role)
        .then(() => {
          this.setState({ redirect: "/role/view/all" });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      updateRoleById(roleId, role)
        .then(() => {
          this.setState({ redirect: "/role/view/all" });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  getValueFor(field) {
    return field === null ? "" : field;
  }

  render() {
    const { role, roleId, redirect, inheritedRoles, allPrivileges, isLoading } =
      this.state;
    const {
      roleChangeHandler,
      descriptionChangeHandler,
      saveRole,
      getValueFor,
      inheritedRoleChangeHandler,
      privilegeChangeHandler,
      cancel,
      deleteRole,
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

          {role.childRoles.length > 0 && (
            <div>
              <p>Roles that contain (inherit privileges from) {role.role}</p>
              <ul>
                {role.childRoles.map((childRole) => (
                  <li key={childRole.uuid}>
                    <a href={`/role/edit/${childRole.uuid}`}>
                      {childRole.childRoleName}
                    </a>
                  </li>
                ))}
              </ul>
              <br />
            </div>
          )}

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
              <p>
                Greyed out checkboxes represent privileges inherited from other
                roles, these cannot be removed individually.
              </p>
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
            Save
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
