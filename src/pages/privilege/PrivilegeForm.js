import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  buttonStyle,
  inputStyle,
  labelStyle,
  paperStyle,
} from "../../constants/formStyling";
import {
  deletePrivilegeById,
  getPrivilegeById,
  insertPrivilege,
  updatePrivilegeById,
} from "../../services/privilegeService";

import { GET_VALUE } from "../../constants/otherConstants";
import { Paper } from "@material-ui/core";
import React from "react";

class PrivilegeForm extends React.Component {
  constructor(props) {
    super(props);
    const initialPrivilegeState = {
      privilege: null,
      description: null,
      uuid: null,
    };

    this.state = {
      privilege: initialPrivilegeState,
      privilegeId: this.props.match.params.id,
      redirect: null,
      isLoading: true,
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount() {
    const { privilegeId } = this.state;
    if (privilegeId !== "add") {
      getPrivilegeById(privilegeId)
        .then((response) => {
          this.setState({ privilege: response.data }, () => {
            this.setState({ isLoading: false });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  inputChangeHandler = (event) => {
    const { name, value } = event.target;
    const { privilege } = this.state;
    privilege[name] = value;
    this.setState({ privilege });
  };

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

  render() {
    const {
      inputChangeHandler,
      savePrivilege,
      cancelButtonHandler,
      deletePrivilege,
    } = this;

    const { privilege, privilegeId, redirect, isLoading } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <p>Loading...</p>;

    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          <label htmlFor="privilege" style={labelStyle}>
            Privilege Name :
            <input
              style={inputStyle}
              type="text"
              id="privilege"
              name="privilege"
              disabled={privilegeId === "add" ? false : true}
              value={GET_VALUE(privilege.privilege)}
              onChange={inputChangeHandler}
            />
          </label>
          <br />

          <label htmlFor="description" style={labelStyle}>
            Description :
            <textarea
              style={inputStyle}
              id="description"
              name="description"
              rows="3"
              cols="20"
              value={GET_VALUE(privilege.description)}
              onChange={inputChangeHandler}
            />
          </label>
          <br />

          <button
            type="button"
            style={buttonStyle}
            onClick={savePrivilege.bind(this)}
          >
            Save
          </button>
          <button
            type="button"
            style={buttonStyle}
            onClick={cancelButtonHandler.bind(this)}
          >
            Cancel
          </button>
          <button
            type="button"
            style={buttonStyle}
            onClick={deletePrivilege.bind(this)}
          >
            Delete
          </button>

          <br />
        </Paper>
      </React.Fragment>
    );
  }
}
export default withRouter(PrivilegeForm);
