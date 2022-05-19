import { Button, Paper, TextField } from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  buttonStyle,
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
  saveVisitType(successMessage = "updated") {
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
        this.successAndRedirect("saved");
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
      this.saveVisitType("retired");
    });
  }

  unretireVisitType() {
    const { visitType } = this.state;
    visitType.retireReason = null;
    visitType.retired = false;
    this.setState({ visitType }, () => {
      this.saveVisitType("un-retired");
    });
  }

  cancelVisitType() {
    this.setState({ redirect: this.viewAll });
  }

  deleteVisitType() {
    const { visitTypeId } = this.state;
    deleteVisitTypeById(visitTypeId)
      .then(() => {
        this.successAndRedirect("deleted");
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
        {error && <span>{errors.globalErrorMessage}</span>}

        <Paper style={paperStyle}>
          <TextField
            style={inputStyle}
            label="Name"
            type="text"
            id="name"
            name="name"
            value={GET_VALUE(visitType.name)}
            onChange={(e) => visitTypeChangeHandler(e)}
          />
          <span>{error && errors.nameHasError && errors.name}</span>

          <br />
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

          <br />
          <div style={buttonGroupStyle}>
            <Controls.SaveButton onClick={() => saveVisitType()} />
            <Controls.CancelButton
              type="button"
              onClick={() => cancelVisitType()}
            />
          </div>

          <br />
        </Paper>

        {visitTypeId !== "add" && !visitType.retired && (
          <Paper style={paperStyle}>
            <TextField
              style={inputStyle}
              label="Reason to retire"
              type="text"
              id="retireReason"
              name="retireReason"
              multiline
              value={GET_VALUE(visitType.retireReason)}
              onChange={(e) => visitTypeChangeHandler(e)}
            />
            <span>
              {error && errors.retireReasonHasError && errors.retireReason}
            </span>

            <br />
            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={visitType.retired}
                onClick={() => retireVisitType()}
              />
            </div>

            <br />
          </Paper>
        )}

        {visitTypeId !== "add" && visitType.retired && (
          <Paper style={paperStyle}>
            <hr />

            <p style={subHeadingStyle}>Unretire Visit Type</p>
            <div style={buttonGroupStyle}>
              <Button type="button" onClick={() => unretireVisitType()}>
                Unretire Visit Type
              </Button>
            </div>

            <br />
          </Paper>
        )}

        {visitTypeId !== "add" && (
          <div style={paperStyle}>
            <div style={buttonGroupStyle}>
              <Controls.DeleteButton onClick={() => deleteVisitType()} />
            </div>
            <br />
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(VisitTypeForm);
