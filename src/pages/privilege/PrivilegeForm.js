import { Redirect, withRouter } from "react-router-dom";
import React from "react";
import {
  insertPrivilege,
  getPrivilegeById,
  updatePrivilegeById,
  deletePrivilegeById
} from "../../services/privilegeService";

class PrivilegeForm extends React.Component {
  constructor(props) {
    super(props);
    const initialPrivilegeState = {
      privilege: "",
      description: "",
      uuid: ""
    };

    this.state = {
      privilege: initialPrivilegeState,
      privilegeId: this.props.match.params.id,
      redirect: null
    };
  }

  componentDidMount() {
    const { privilegeId } = this.state;
    if (privilegeId !== "add") {
      getPrivilegeById(privilegeId)
        .then((response) => {
          this.setState({ privilege: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  privilegeChangeHandler(event) {
    const { privilege } = this.state;
    privilege.privilege = event.target.value;
    this.setState({ privilege });
  }

  descriptionChangeHandler(event) {
    const { privilege } = this.state;
    privilege.description = event.target.value;
    this.setState({ privilege });
  }

  savePrivilege() {
    const { privilegeId, privilege } = this.state;
    if (privilegeId === "add") {
      insertPrivilege(privilege)
        .then(() => {
          this.setState({ redirect: "/privilege/view/all" });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      updatePrivilegeById(privilegeId, privilege)
        .then(() => {
          this.setState({ redirect: "/privilege/view/all" });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  cancelButtonHandler() {
    this.setState({ redirect: "/privilege/view/all" });
  }

  deletePrivilege() {
    let { privilegeId } = this.state;
    deletePrivilegeById(privilegeId)
      .then(() => {
        this.setState({ redirect: "/privilege/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getValueFor(field) {
    return field === null ? "" : field;
  }

  render() {
    const { privilege, privilegeId, redirect } = this.state;
    const {
      privilegeChangeHandler,
      descriptionChangeHandler,
      savePrivilege,
      getValueFor,
      cancelButtonHandler,
      deletePrivilege
    } = this;

    if (redirect) return <Redirect to={redirect} />;

    return (
      <React.Fragment>
        <div>
          <label htmlFor="privilege">
            Privilege Name :
            <input
              type="text"
              id="privilege"
              name="privilege"
              disabled={privilegeId === "add" ? false : true}
              value={getValueFor(privilege.privilege)}
              onChange={privilegeChangeHandler.bind(this)}
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
              value={getValueFor(privilege.description)}
              onChange={descriptionChangeHandler.bind(this)}
            />
          </label>
          <br />

          <button type="button" onClick={savePrivilege.bind(this)}>
            Save Visit Type
          </button>
          <button type="button" onClick={cancelButtonHandler.bind(this)}>
            Cancel
          </button>
          <button type="button" onClick={deletePrivilege.bind(this)}>
            Delete
          </button>
          <br />
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(PrivilegeForm);
