import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import { FILTER_OPTIONS, GET_VALUE } from "../../constants/otherConstants";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  checkboxLabelStyle,
  deleteButtonStyle,
  globalError,
  inputStyle,
  paperStyle,
  subHeadingStyle,
} from "../../constants/formStyling";
import {
  deleteDrugById,
  getDrugById,
  insertDrug,
  updateDrugById,
} from "../../services/drugService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import React from "react";
import { SingleSelect } from "react-select-material-ui";
import SuccessMessage from "../../utils/SuccessMessage";
import { getConceptNames } from "../../services/conceptService";

class DrugForm extends React.Component {
  constructor(props) {
    super(props);

    const initialDrugState = {
      combination: false,
      conceptId: null,
      dosageForm: null,
      maximumDailyDose: null,
      minimumDailyDose: null,
      name: null,
      retired: false,
      strength: null,
      retireReason: null,
    };

    this.state = {
      drug: initialDrugState,
      drugId: this.props.match.params.id,
      options: [],
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
        conceptId: "concept can not be empty",
        conceptIdHasError: false,
        retireReason: "reason to retire can not be empty",
        retireReasonHasError: false,
      },
    };

    this.viewAll = "/drug/view/all";

    this.saveDrug = this.saveDrug.bind(this);
    this.retireDrug = this.retireDrug.bind(this);
    this.unretireDrug = this.unretireDrug.bind(this);
    this.cancelDrug = this.cancelDrug.bind(this);
    this.deleteDrug = this.deleteDrug.bind(this);
    this.drugChangeHandler = this.drugChangeHandler.bind(this);
    this.drugSelectTypeInputChangeHandler =
      this.drugSelectTypeInputChangeHandler.bind(this);
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

  nonEmptyInteger(object) {
    return object && object !== "";
  }

  resetErrorsToFalse() {
    return new Promise((resolve) => {
      const { errors } = this.state;
      errors.nameHasError = false;
      errors.conceptIdHasError = false;
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

  validate(drug) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors } = this.state;
        let error = false;

        if (!this.nonEmpty(drug.name)) {
          error = true;
          errors.nameHasError = true;
        }

        if (!this.nonEmptyInteger(drug.conceptId)) {
          error = true;
          errors.conceptIdHasError = true;
        }

        if (drug.retired) {
          if (!this.nonEmpty(drug.retireReason)) {
            error = true;
            errors.retireReasonHasError = true;
            drug.retired = false;
          }
        }

        this.setState({ error, errors, drug }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // component mount starts
  componentDidMount() {
    const { drugId } = this.state;

    this.setOptions()
      .then(() => this.setFetchedDrug(drugId))
      .then(() => this.setState({ isLoading: false }));
  }

  setOptions() {
    return new Promise((resolve) => {
      getConceptNames()
        .then((response) => {
          const options = [];
          Object.keys(response.data).forEach((key) => {
            options.push({
              value: response.data[key].conceptId,
              label: response.data[key].name,
            });
          });
          this.setState({ options }, () => resolve());
        })
        .catch((error) => {
          console.log(error);
          this.setHttpError("getConceptNames", error.message);
        });
    });
  }

  setFetchedDrug(drugId) {
    return new Promise((resolve) => {
      if (drugId !== "add") {
        getDrugById(drugId)
          .then((response) => {
            this.setState({ drug: response.data }, () => resolve());
          })
          .catch((error) => {
            console.log(error);
            this.setHttpError("getDrugById", error.message);
          });
      } else {
        resolve();
      }
    });
  }
  // component mount ends

  // save starts
  saveDrug(successMessage = "Updated") {
    const { drugId, drug } = this.state;
    this.validate(drug).then(() => {
      const { error } = this.state;
      if (!error) {
        if (drugId === "add") this.insertDrugWithData(drug);
        else this.updateDrugWithData(drugId, drug, successMessage);
      }
    });
  }

  insertDrugWithData(drug) {
    insertDrug(drug)
      .then(() => {
        this.successAndRedirect("Saved");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("insertDrug", error.message);
      });
  }

  updateDrugWithData(drugId, drug, successMessage) {
    updateDrugById(drugId, drug)
      .then(() => {
        this.successAndRedirect(successMessage);
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("updateDrugById", error.message);
      });
  }
  // save ends

  retireDrug() {
    const { drug } = this.state;
    drug.retired = true;
    this.setState({ drug }, () => {
      this.saveDrug("Retired");
    });
  }

  unretireDrug() {
    const { drug } = this.state;
    drug.retireReason = null;
    drug.retired = false;
    this.setState({ drug }, () => {
      this.saveDrug("Un-Retired");
    });
  }

  cancelDrug() {
    this.setState({ redirect: this.viewAll });
  }

  deleteDrug() {
    const { drugId } = this.state;
    deleteDrugById(drugId)
      .then(() => {
        this.successAndRedirect("Deleted");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("deleteDrugById", error.message);
      });
  }

  // input change handlers
  drugChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const { drug } = this.state;
    drug[name] = event.target[type];
    this.setState({ drug });
  };

  drugSelectTypeInputChangeHandler(selectedValue, field) {
    const { drug } = this.state;
    drug[field] = selectedValue;
    this.setState({ drug });
  }

  render() {
    const {
      saveDrug,
      retireDrug,
      unretireDrug,
      cancelDrug,
      deleteDrug,
      drugChangeHandler,
      drugSelectTypeInputChangeHandler,
    } = this;

    const {
      drug,
      drugId,
      options,
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
            label="Name"
            style={inputStyle}
            type="text"
            id="name"
            name="name"
            onChange={(e) => drugChangeHandler(e)}
            value={GET_VALUE(drug.name)}
            required
          />

          <SingleSelect
            error={errors.conceptIdHasError}
            helperText={errors.conceptIdHasError && errors.conceptId}
            label="Concept"
            style={inputStyle}
            id="conceptId"
            name="conceptId"
            placeholder="Enter concept name or id"
            defaultValue={GET_VALUE(drug.conceptId)}
            onChange={(selectedValue) =>
              drugSelectTypeInputChangeHandler(selectedValue, "conceptId")
            }
            options={options}
            filterOption={FILTER_OPTIONS}
            required
          />

          <FormControlLabel
            style={inputStyle}
            control={
              <Checkbox
                type="checkbox"
                id="combination"
                name="combination"
                onChange={(e) => drugChangeHandler(e, "checked")}
                checked={GET_VALUE(drug.combination)}
              />
            }
            label={<span style={checkboxLabelStyle}>Combination</span>}
          />

          <SingleSelect
            label="Dosage Form"
            style={inputStyle}
            id="dosageForm"
            name="dosageForm"
            placeholder="Enter concept name or id"
            defaultValue={GET_VALUE(drug.dosageForm)}
            onChange={(selectedValue) =>
              drugSelectTypeInputChangeHandler(selectedValue, "dosageForm")
            }
            options={options}
            filterOption={FILTER_OPTIONS}
          />

          <TextField
            style={inputStyle}
            label="Strength"
            type="text"
            id="strength"
            name="strength"
            onChange={(e) => drugChangeHandler(e)}
            value={GET_VALUE(drug.strength)}
          />

          <TextField
            style={inputStyle}
            label="Minimum Daily Dose"
            type="number"
            id="minimumDailyDose"
            name="minimumDailyDose"
            onChange={(e) => drugChangeHandler(e)}
            value={GET_VALUE(drug.minimumDailyDose)}
            step="any"
          />

          <TextField
            style={inputStyle}
            label="Maximum Daily Dose"
            type="number"
            id="maximumDailyDose"
            name="maximumDailyDose"
            onChange={(e) => drugChangeHandler(e)}
            value={GET_VALUE(drug.maximumDailyDose)}
            step="any"
          />

          <Grid container style={{ gridGap: 5 }}>
            <Controls.SaveButton onClick={() => saveDrug()} />
            <Controls.CancelButton onClick={() => cancelDrug()} />
          </Grid>
        </Paper>

        {drugId !== "add" && !drug.retired && (
          <Paper style={paperStyle}>
            <TextField
              error={errors.retireReasonHasError}
              helperText={errors.retireReasonHasError && errors.retireReason}
              style={inputStyle}
              label="Reason to retire"
              type="text"
              id="retireReason"
              name="retireReason"
              onChange={(e) => drugChangeHandler(e)}
              value={GET_VALUE(drug.retireReason)}
              required
            />

            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={drug.retired}
                onClick={() => retireDrug()}
              />
            </div>
          </Paper>
        )}

        {drugId !== "add" && drug.retired && (
          <Paper style={paperStyle}>
            <p style={subHeadingStyle}>Unretire Drug</p>
            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={drug.retired}
                onClick={() => unretireDrug()}
              />
            </div>
          </Paper>
        )}

        {drugId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deleteDrug()}
          />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(DrugForm);
