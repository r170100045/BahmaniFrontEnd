import { FILTER_OPTIONS, GET_VALUE } from "../../constants/otherConstants";
import { Paper, TextField } from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  buttonStyle,
  inputStyle,
  labelStyle,
  paperStyle,
  subHeadingStyle,
} from "../../constants/formStyling";
import {
  deleteDrugById,
  getDrugById,
  insertDrug,
  updateDrugById,
} from "../../services/drugService";

import React from "react";
import Select from "react-select";
import { SingleSelect } from "react-select-material-ui";
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
      redirect: null,
      drugId: this.props.match.params.id,
      options: [],
      isLoading: true,
      error: false,
    };

    this.drugInputChangeHandler = this.drugInputChangeHandler.bind(this);
  }

  componentDidMount() {
    const { drugId } = this.state;

    getConceptNames()
      .then((response) => {
        const options = [];
        Object.keys(response.data).forEach((key) => {
          options.push({
            value: response.data[key].conceptId,
            label: response.data[key].name,
          });
        });

        this.setState({ options }, () => {
          if (drugId !== "add") {
            getDrugById(drugId)
              .then((response) => {
                this.setState({ drug: response.data, isLoading: false });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            this.setState({ isLoading: false });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  unretireDrug() {
    const { drug, drugId } = this.state;
    drug.retired = false;
    this.setState({ drug }, () => {
      updateDrugById(drugId, drug)
        .then(() => {
          this.setState({ redirect: "/drug/view/all" });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  drugInputChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const { drug } = this.state;
    drug[name] = event.target[type];
    this.setState({ drug });
  };

  conceptIdChangeHandler(selectedOption) {
    const { drug } = this.state;
    drug.conceptId = selectedOption.value;
    this.setState({ drug });
  }

  dosageFormChangeHandler(selectedOption) {
    const { drug } = this.state;
    drug.dosageForm = selectedOption.value;
    this.setState({ drug });
  }

  submitDrugFormHandler() {
    const { drug, drugId } = this.state;
    if (drug.name === "" || drug.conceptId === "")
      this.setState({ error: true });
    else {
      if (drugId === "add") {
        insertDrug(drug)
          .then(() => {
            this.setState({ redirect: "/drug/view/all" });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        updateDrugById(drugId, drug)
          .then(() => {
            this.setState({ redirect: "/drug/view/all" });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  cancelButtonHandler() {
    this.setState({ redirect: "/drug/view/all" });
  }

  retireDrug() {
    let { drug, drugId } = this.state;
    drug.retired = true;
    this.setState({ drug }, () => {
      updateDrugById(drugId, drug)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

      this.setState({ redirect: "/drug/view/all" });
    });
  }

  deleteDrug() {
    let { drugId } = this.state;
    deleteDrugById(drugId)
      .then(() => {
        this.setState({ redirect: "/drug/view/all" });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      conceptIdChangeHandler,
      dosageFormChangeHandler,
      unretireDrug,
      submitDrugFormHandler,
      cancelButtonHandler,
      retireDrug,
      deleteDrug,
      drugInputChangeHandler,
    } = this;

    const { drug, redirect, drugId, options, isLoading, error } = this.state;

    const getDefaultConceptIdValue = options.filter(
      (option) => option.value === drug.conceptId
    );

    const getDefaultDosageFormValue = options.filter(
      (option) => option.value === drug.dosageForm
    );

    if (redirect) return <Redirect to={redirect} />;

    if (!isLoading || drugId === "add") {
      return (
        <React.Fragment>
          {error && <p>Fill the required fields</p>}
          {drug.retired && (
            <p>
              This drug is retired by ... ... - {drug.retireReason}{" "}
              <button type="button" onClick={unretireDrug.bind(this)}>
                Unretire this drug
              </button>
            </p>
          )}
          <hr />

          <Paper style={paperStyle}>
            <TextField
              label="Name"
              style={inputStyle}
              type="text"
              id="name"
              name="name"
              onChange={drugInputChangeHandler}
              value={GET_VALUE(drug.name)}
            />
            <br />

            <SingleSelect
              label="Concept*"
              style={inputStyle}
              id="conceptId"
              name="conceptId"
              placeholder="Enter concept name or id"
              defaultValue={GET_VALUE(drug.conceptId)}
              onChange={conceptIdChangeHandler.bind(this)}
              options={options}
              filterOption={FILTER_OPTIONS}
            />

            <br />
            <label htmlFor="combination" style={inputStyle}>
              Combination:
              <input
                type="checkbox"
                id="combination"
                name="combination"
                onChange={(e) => drugInputChangeHandler(e, "checked")}
                checked={GET_VALUE(drug.combination)}
              />
            </label>
            <br />

            <label htmlFor="dosageForm" style={inputStyle}>
              Dosage Form:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  id="dosageForm"
                  name="dosageForm"
                  placeholder="Enter concept name or id"
                  defaultValue={getDefaultDosageFormValue}
                  onChange={dosageFormChangeHandler.bind(this)}
                  options={options}
                  filterOption={FILTER_OPTIONS}
                />
              </div>
            </label>

            <br />

            <TextField
              style={inputStyle}
              label="Strength"
              type="text"
              id="strength"
              name="strength"
              onChange={drugInputChangeHandler}
              value={GET_VALUE(drug.strength)}
            />
            <br />
            <button type="button" onClick={retireDrug.bind(this)}>
              Retire this Drug
            </button>

            <label htmlFor="minimumDailyDose" style={inputStyle}>
              Minimum Daily Dose:
              <input
                type="number"
                id="minimumDailyDose"
                name="minimumDailyDose"
                onChange={drugInputChangeHandler}
                value={GET_VALUE(drug.minimumDailyDose)}
                step="any"
              />
            </label>
            <br />

            <label htmlFor="maximumDailyDose" style={inputStyle}>
              Maximum Daily Dose:
              <input
                type="number"
                id="maximumDailyDose"
                name="maximumDailyDose"
                onChange={drugInputChangeHandler}
                value={GET_VALUE(drug.maximumDailyDose)}
                step="any"
              />
            </label>
            <br />
            <div style={buttonGroupStyle}>
              <button
                type="button"
                style={buttonStyle}
                onClick={submitDrugFormHandler.bind(this)}
              >
                Save Concept Drug
              </button>
              <button
                type="button"
                style={buttonStyle}
                onClick={cancelButtonHandler.bind(this)}
              >
                Cancel
              </button>
            </div>
          </Paper>
          <hr />

          {drugId !== "add" && (
            <Paper style={paperStyle}>
              <p style={subHeadingStyle}>Retire this Drug</p>
              <TextField
                style={inputStyle}
                label="Reason"
                type="text"
                id="retireReason"
                name="retireReason"
                onChange={drugInputChangeHandler}
                value={GET_VALUE(drug.retireReason)}
              />
              <br />
              <div style={buttonGroupStyle}>
                <button type="button" onClick={retireDrug.bind(this)}>
                  Retire this Drug
                </button>
              </div>

              <hr />

              <p style={subHeadingStyle}>Permanently Delete Concept Drug</p>
              <br />
              <div style={buttonGroupStyle}>
                <button type="button" onClick={deleteDrug.bind(this)}>
                  Permanently Delete Concept Drug
                </button>
              </div>
            </Paper>
          )}
        </React.Fragment>
      );
    }

    return <p>Loading...</p>;
  }
}

export default withRouter(DrugForm);
