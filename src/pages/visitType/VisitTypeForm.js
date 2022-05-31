import { Button, Paper, TextField } from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  buttonStyle,
  deleteButtonStyle,
  globalError,
  inputError,
  inputStyle,
  paperStyle,
  subHeadingStyle,
} from "../../constants/formStyling";
import {
  deleteVisitTypeById,
  getVisitTypeById,
  insertVisitType,
  updateVisitTypeById,
} from "../../services/visitTypeService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import SuccessMessage from "../../utils/SuccessMessage";

class VisitTypeForm extends React.Component {
  constructor(props) {
    super(props);

    const initialVisitTypeState = {
      name: null,
      description: null,
      retireReason: null,
      retired: false,
    };

    this.state = {
      visitType: initialVisitTypeState,
      visitTypeId: this.props.match.params.id,
      redirect: null,
      isLoading: true,
      showSuccessMessage: false,
      successMessage: null,
      error: false,
      errors: {
        globalErrorMessage: "Please fix all errors and try again.",
        httpRequest: null,
        httpRequestHasError: false,
        name: "name can not be empty",
        nameHasError: false,
        retireReason: "reason to retire can not be empty",
        retireReasonHasError: false,
      },
    };

    this.viewAll = "/visitType/view/all";

    this.saveVisitType = this.saveVisitType.bind(this);
    this.retireVisitType = this.retireVisitType.bind(this);
    this.unretireVisitType = this.unretireVisitType.bind(this);
    this.cancelVisitType = this.cancelVisitType.bind(this);
    this.deleteVisitType = this.deleteVisitType.bind(this);
    this.visitTypeChangeHandler = this.visitTypeChangeHandler.bind(this);
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

  resetErrorsToFalse() {
    return new Promise((resolve) => {
      const { errors } = this.state;
      errors.nameHasError = false;
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

  validate(visitType) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors } = this.state;
        let error = false;

        if (!this.nonEmpty(visitType.name)) {
          error = true;
          errors.nameHasError = true;
        }

        if (visitType.retired) {
          if (!this.nonEmpty(visitType.retireReason)) {
            error = true;
            errors.retireReasonHasError = true;
            visitType.retired = false;
          }
        }

        this.setState({ error, errors, visitType }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // component mount starts
  componentDidMount() {
    const { visitTypeId } = this.state;
    if (visitTypeId !== "add") {
      getVisitTypeById(visitTypeId)
        .then((response) => {
          this.setState({ visitType: response.data }, () => {
            this.setState({ isLoading: false });
          });
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getVisitTypeById", error.message);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }
  // component mount ends

  // save starts
  saveVisitType(successMessage = "UPDATED") {
    const { visitTypeId, visitType } = this.state;
    this.validate(visitType).then(() => {
      const { error } = this.state;
      if (!error) {
        if (visitTypeId === "add") this.insertVisitTypeWithData(visitType);
        else
          this.updateVisitTypeWithData(visitTypeId, visitType, successMessage);
      }
    });
  }

  insertVisitTypeWithData(visitType) {
    insertVisitType(visitType)
      .then(() => {
        this.successAndRedirect("SAVED");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("insertVisitType", error.message);
      });
  }

  updateVisitTypeWithData(visitTypeId, visitType, successMessage) {
    console.log("vt", visitType);
    updateVisitTypeById(visitTypeId, visitType)
      .then(() => {
        this.successAndRedirect(successMessage);
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("updateVisitTypeById", error.message);
      });
  }
  // save ends

  retireVisitType() {
    const { visitType } = this.state;
    visitType.retired = true;
    this.setState({ visitType }, () => {
      this.saveVisitType("RETIRED");
    });
  }

  unretireVisitType() {
    const { visitType } = this.state;
    visitType.retireReason = null;
    visitType.retired = false;
    this.setState({ visitType }, () => {
      this.saveVisitType("UN-RETIRED");
    });
  }

  cancelVisitType() {
    this.setState({ redirect: this.viewAll });
  }

  deleteVisitType() {
    const { visitTypeId } = this.state;
    deleteVisitTypeById(visitTypeId)
      .then(() => {
        this.successAndRedirect("DELETED");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("deleteVisitTypeById", error.message);
      });
  }

  // input change handlers
  visitTypeChangeHandler = (event) => {
    const { name, value } = event.target;
    const { visitType } = this.state;
    visitType[name] = value;
    this.setState({ visitType });
  };

  render() {
    const {
      saveVisitType,
      retireVisitType,
      unretireVisitType,
      cancelVisitType,
      deleteVisitType,
      visitTypeChangeHandler,
    } = this;

    const {
      visitType,
      visitTypeId,
      redirect,
      isLoading,
      error,
      errors,
      showSuccessMessage,
      successMessage,
    } = this.state;

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

          <TextField
            error={errors.nameHasError}
            helperText={errors.nameHasError && errors.name}
            style={inputStyle}
            label="Name"
            type="text"
            id="name"
            name="name"
            value={GET_VALUE(visitType.name)}
            onChange={(e) => visitTypeChangeHandler(e)}
            required
          />

          <TextField
            style={inputStyle}
            label="Description"
            id="description"
            name="description"
            rows="3"
            cols="20"
            multiline
            value={GET_VALUE(visitType.description)}
            onChange={(e) => visitTypeChangeHandler(e)}
          />

          <div style={buttonGroupStyle}>
            <Controls.SaveButton onClick={() => saveVisitType()} />
            <Controls.CancelButton
              type="button"
              onClick={() => cancelVisitType()}
            />
          </div>
        </Paper>

        {visitTypeId !== "add" && !visitType.retired && (
          <Paper style={paperStyle}>
            <TextField
              error={errors.retireReasonHasError}
              helperText={errors.retireReasonHasError && errors.retireReason}
              style={inputStyle}
              label="Reason to retire"
              type="text"
              id="retireReason"
              name="retireReason"
              multiline
              value={GET_VALUE(visitType.retireReason)}
              onChange={(e) => visitTypeChangeHandler(e)}
            />

            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={visitType.retired}
                onClick={() => retireVisitType()}
              />
            </div>
          </Paper>
        )}

        {visitTypeId !== "add" && visitType.retired && (
          <Paper style={paperStyle}>
            <p style={subHeadingStyle}>Unretire Visit Type</p>
            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={visitType.retired}
                onClick={() => unretireVisitType()}
              />
            </div>
          </Paper>
        )}

        {visitTypeId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deleteVisitType()}
          />
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(VisitTypeForm);
