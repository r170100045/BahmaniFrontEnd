import { Grid, Paper, TextField } from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  deleteButtonStyle,
  globalError,
  inputStyle,
  paperStyle,
  subHeadingStyle,
} from "../../constants/formStyling";
import {
  deletePatientRelationshipTypeById,
  getPatientRelationshipTypeById,
  insertPatientRelationshipType,
  updatePatientRelationshipTypeById,
} from "../../services/patientRelationshipTypeService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import SuccessMessage from "../../utils/SuccessMessage";

class PatientRelationshipTypeForm extends React.Component {
  constructor(props) {
    super(props);
    const initialRelationshipTypeState = {
      aisToB: null,
      bisToA: null,
      description: null,
      retireReason: null,
      retired: false,
    };

    this.state = {
      relationshipType: initialRelationshipTypeState,
      relationshipTypeId: this.props.match.params.id,
      redirect: null,
      isLoading: true,
      showSuccessMessage: false,
      successMessage: null,
      error: false,
      errors: {
        globalErrorMessage: "Please fix all errors and try again.",
        httpRequest: null,
        httpRequestHasError: false,
        aisToB: "A is to B relation can not be empty",
        aisToBHasError: false,
        bisToA: "B is to A relation can not be empty",
        bisToAHasError: false,
        description: "description can not be empty",
        descriptionHasError: false,
        retireReason: "reason to retire can not be empty",
        retireReasonHasError: false,
      },
    };

    this.viewAll = "/patientRelationshipType/view/all";

    this.saveRelationshipType = this.saveRelationshipType.bind(this);
    this.retireRelationshipType = this.retireRelationshipType.bind(this);
    this.unretireRelationshipType = this.unretireRelationshipType.bind(this);
    this.cancelRelationshipType = this.cancelRelationshipType.bind(this);
    this.deleteRelationshipType = this.deleteRelationshipType.bind(this);
    this.relationshipTypeChangeHandler =
      this.relationshipTypeChangeHandler.bind(this);
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
      errors.aisToBHasError = false;
      errors.bisToAHasError = false;
      errors.descriptionHasError = false;
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

  validate(relationshipType) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors } = this.state;
        let error = false;

        if (!this.nonEmpty(relationshipType.aisToB)) {
          error = true;
          errors.aisToBHasError = true;
        }

        if (!this.nonEmpty(relationshipType.bisToA)) {
          error = true;
          errors.bisToAHasError = true;
        }

        if (!this.nonEmpty(relationshipType.description)) {
          error = true;
          errors.descriptionHasError = true;
        }

        if (relationshipType.retired) {
          if (!this.nonEmpty(relationshipType.retireReason)) {
            error = true;
            errors.retireReasonHasError = true;
            relationshipType.retired = false;
          }
        }

        this.setState({ error, errors, relationshipType }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // component mount starts
  componentDidMount() {
    const { relationshipTypeId } = this.state;
    if (relationshipTypeId !== "add") {
      getPatientRelationshipTypeById(relationshipTypeId)
        .then((response) => {
          this.setState({ relationshipType: response.data }, () => {
            this.setState({ isLoading: false });
          });
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getPatientRelationshipTypeById", error.message);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }
  // component mount ends

  // save starts
  saveRelationshipType(successMessage = "Updated") {
    const { relationshipTypeId, relationshipType } = this.state;
    this.validate(relationshipType).then(() => {
      const { error } = this.state;
      if (!error) {
        if (relationshipTypeId === "add")
          this.insertPatientRelationshipTypeWithData(relationshipType);
        else
          this.updatePatientRelationshipTypeWithData(
            relationshipTypeId,
            relationshipType,
            successMessage
          );
      }
    });
  }

  insertPatientRelationshipTypeWithData(relationshipType) {
    insertPatientRelationshipType(relationshipType)
      .then(() => {
        this.successAndRedirect("Saved");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("insertPatientRelationshipType", error.message);
      });
  }

  updatePatientRelationshipTypeWithData(
    relationshipTypeId,
    relationshipType,
    successMessage
  ) {
    updatePatientRelationshipTypeById(relationshipTypeId, relationshipType)
      .then(() => {
        this.successAndRedirect(successMessage);
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("updatePatientRelationshipTypeById", error.message);
      });
  }
  // save ends

  retireRelationshipType() {
    const { relationshipType } = this.state;
    relationshipType.retired = true;
    this.setState({ relationshipType }, () => {
      this.saveRelationshipType("Retired");
    });
  }

  unretireRelationshipType() {
    const { relationshipType } = this.state;
    relationshipType.retireReason = null;
    relationshipType.retired = false;
    this.setState({ relationshipType }, () => {
      this.saveRelationshipType("Un-Retired");
    });
  }

  cancelRelationshipType() {
    this.setState({ redirect: this.viewAll });
  }

  deleteRelationshipType() {
    const { relationshipTypeId } = this.state;
    deletePatientRelationshipTypeById(relationshipTypeId)
      .then(() => {
        this.successAndRedirect("Deleted");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("deletePatientRelationshipTypeById", error.message);
      });
  }

  // input change handlers
  relationshipTypeChangeHandler = (event) => {
    const { name, value } = event.target;
    const { relationshipType } = this.state;
    relationshipType[name] = value;
    this.setState({ relationshipType });
  };

  render() {
    const {
      saveRelationshipType,
      retireRelationshipType,
      unretireRelationshipType,
      cancelRelationshipType,
      deleteRelationshipType,
      relationshipTypeChangeHandler,
    } = this;

    const {
      relationshipType,
      relationshipTypeId,
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
            error={errors.aisToBHasError}
            helperText={errors.aisToBHasError && errors.aisToB}
            style={inputStyle}
            label="A is to B"
            type="text"
            id="aisToB"
            name="aisToB"
            value={GET_VALUE(relationshipType.aisToB)}
            onChange={(e) => relationshipTypeChangeHandler(e)}
            required
          />

          <TextField
            error={errors.bisToAHasError}
            helperText={errors.bisToAHasError && errors.bisToA}
            style={inputStyle}
            label="B is to A"
            type="text"
            id="bisToA"
            name="bisToA"
            value={GET_VALUE(relationshipType.bisToA)}
            onChange={(e) => relationshipTypeChangeHandler(e)}
            required
          />

          <TextField
            error={errors.descriptionHasError}
            helperText={errors.descriptionHasError && errors.description}
            style={inputStyle}
            multiline
            label="Description"
            id="description"
            name="description"
            rows="3"
            cols="20"
            value={GET_VALUE(relationshipType.description)}
            onChange={(e) => relationshipTypeChangeHandler(e)}
            required
          />

          <Grid container style={{ gridGap: 5 }}>
            <Controls.SaveButton onClick={() => saveRelationshipType()} />
            <Controls.CancelButton onClick={() => cancelRelationshipType()} />
          </Grid>
        </Paper>

        {relationshipTypeId !== "add" && !relationshipType.retired && (
          <Paper style={paperStyle}>
            <TextField
              error={errors.retireReasonHasError}
              helperText={errors.retireReasonHasError && errors.retireReason}
              style={inputStyle}
              label="Reason to retire"
              type="text"
              id="retireReason"
              name="retireReason"
              value={GET_VALUE(relationshipType.retireReason)}
              onChange={(e) => relationshipTypeChangeHandler(e)}
              required
            />

            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={relationshipType.retired}
                onClick={() => retireRelationshipType()}
              />
            </div>
          </Paper>
        )}
        {relationshipTypeId !== "add" && relationshipType.retired && (
          <Paper style={paperStyle}>
            <p style={subHeadingStyle}>Unretire Relationship Type</p>
            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={relationshipType.retired}
                onClick={() => unretireRelationshipType()}
              />
            </div>
            <br />
          </Paper>
        )}

        {relationshipTypeId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deleteRelationshipType()}
          />
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(PatientRelationshipTypeForm);
