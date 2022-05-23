import {
  Button,
  Input,
  Paper,
  TextField,
  TextareaAutosize,
} from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  buttonStyle,
  globalError,
  inputError,
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

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import SuccessMessage from "../../utils/SuccessMessage";

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
      showSuccessMessage: false,
      successMessage: null,
      error: false,
      errors: {
        globalErrorMessage: "Please fix all errors and try again.",
        httpRequest: null,
        httpRequestHasError: false,
        privilege: "privilege name can not be empty",
        privilegeHasError: false,
      },
    };

    this.viewAll = "/privilege/view/all";

    this.savePrivilege = this.savePrivilege.bind(this);
    this.cancelPrivilege = this.cancelPrivilege.bind(this);
    this.deletePrivilege = this.deletePrivilege.bind(this);
    this.privilegeChangeHandler = this.privilegeChangeHandler.bind(this);
  }

  // component mount starts
  componentDidMount() {
    const { privilegeId } = this.state;
    if (privilegeId !== "add") {
      getPrivilegeById(privilegeId)
        .then((response) => {
          this.setState({ privilege: response.data }, () => {
            this.setState({ isLoading: false });
          });
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getPrivilegeById", error.message);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }
  // component mount ends

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

  resetErrorsToFalse() {
    return new Promise((resolve) => {
      const { errors } = this.state;
      errors.privilegeHasError = false;
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

  validate(privilege) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors } = this.state;
        let error = false;

        if (!this.nonEmpty(privilege.privilege)) {
          error = true;
          errors.privilegeHasError = true;
        }

        this.setState({ error, errors, privilege }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // save starts
  savePrivilege(successMessage = "updated") {
    const { privilegeId, privilege } = this.state;
    this.validate(privilege).then(() => {
      const { error } = this.state;
      if (!error) {
        if (privilegeId === "add") this.insertPrivilegeWithData(privilege);
        else
          this.updatePrivilegeWithData(privilegeId, privilege, successMessage);
      }
    });
  }

  insertPrivilegeWithData(privilege) {
    insertPrivilege(privilege)
      .then(() => {
        this.successAndRedirect("saved");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("insertPrivilege", error.message);
      });
  }

  updatePrivilegeWithData(privilegeId, privilege, successMessage) {
    updatePrivilegeById(privilegeId, privilege)
      .then(() => {
        this.successAndRedirect(successMessage);
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("updatePrivilegeById", error.message);
      });
  }
  // save ends

  cancelPrivilege() {
    this.setState({ redirect: this.viewAll });
  }

  deletePrivilege() {
    const { privilegeId } = this.state;
    deletePrivilegeById(privilegeId)
      .then(() => {
        this.successAndRedirect("deleted");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("deletePrivilegeById", error.message);
      });
  }

  // input change handlers
  privilegeChangeHandler = (event) => {
    const { name, value } = event.target;
    const { privilege } = this.state;
    privilege[name] = value;
    this.setState({ privilege });
  };

  render() {
    const {
      savePrivilege,
      cancelPrivilege,
      deletePrivilege,
      privilegeChangeHandler,
    } = this;

    const {
      privilege,
      privilegeId,
      redirect,
      isLoading,
      error,
      errors,
      showSuccessMessage,
      successMessage,
    } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    if (showSuccessMessage) return <SuccessMessage action={successMessage} />;

    if (isLoading)
      return (
        <div>
          {!errors.httpRequestHasError && <LoadingData />}
          {errors.httpRequestHasError && (
            <ErrorLoadingData message={errors.httpRequest} />
          )}
        </div>
      );

    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          {error && <span>{errors.globalErrorMessage}</span>}

          <TextField
            style={inputStyle}
            label="Privilege Name"
            type="text"
            id="privilege"
            name="privilege"
            disabled={privilegeId === "add" ? false : true}
            value={GET_VALUE(privilege.privilege)}
            onChange={(e) => privilegeChangeHandler(e)}
          />
          <span style={inputError}>
            {error && errors.privilegeHasError && errors.privilege}
          </span>
          <br />

          <TextField
            style={inputStyle}
            label="Description"
            id="description"
            name="description"
            rows="3"
            cols="20"
            multiline
            value={GET_VALUE(privilege.description)}
            onChange={(e) => privilegeChangeHandler(e)}
          />
          <br />
          <div style={buttonGroupStyle}>
            <Controls.SaveButton onClick={() => savePrivilege()} />
            <Controls.CancelButton onClick={() => cancelPrivilege()} />
          </div>
          <br />
        </Paper>
        {privilegeId !== "add" && (
          <div style={paperStyle}>
            <div>
              <Controls.DeleteButton onClick={() => deletePrivilege()} />
            </div>
            <br />
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(PrivilegeForm);
