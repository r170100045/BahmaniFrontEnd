import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  buttonStyle,
  inputStyle,
  labelStyle,
  paperStyle,
} from "../../constants/formStyling";
import {
  deleteDrugById,
  getConceptNames,
  getDrugById,
  postDrug,
  putDrugById,
} from "../../api/services";

import { Paper } from "@material-ui/core";
import React from "react";
import Select from "react-select";

class DrugForm extends React.Component {
  constructor(props) {
    super(props);

    const initialDrugState = {
      combination: false,
      conceptId: "",
      dosageForm: "",
      maximumDailyDose: "",
      minimumDailyDose: "",
      name: "",
      retired: false,
      strength: "",
      retireReason: "",
    };

    this.state = {
      drug: initialDrugState,
      redirect: null,
      drugId: this.props.match.params.id,
      options: [],
      isLoading: true,
      error: false,
    };
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

  getValueFor(field) {
    return field === null ? "" : field;
  }

  unretireDrug() {
    const { drug, drugId } = this.state;
    drug.retired = false;
    this.setState({ drug }, () => {
      putDrugById(drugId, drug)
        .then(() => {
          this.setState({ redirect: "/drug/view/all" });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  nameChangeHandler(event) {
    const { drug } = this.state;
    drug.name = event.target.value;
    this.setState({ drug });
  }

  conceptIdChangeHandler(selectedOption) {
    const { drug } = this.state;
    drug.conceptId = selectedOption.value;
    this.setState({ drug });
  }

  filterOptions(option, inputValue) {
    const { label, value } = option;
    return (
      (label != null &&
        label.toLowerCase().includes(inputValue.toLowerCase())) ||
      value.toString().toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  combinationChangeHandler(event) {
    const { drug } = this.state;
    drug.combination = event.target.checked;
    this.setState({ drug });
  }

  dosageFormChangeHandler(selectedOption) {
    const { drug } = this.state;
    drug.dosageForm = selectedOption.value;
    this.setState({ drug });
  }

  strengthChangeHandler(event) {
    const { drug } = this.state;
    drug.strength = event.target.value;
    this.setState({ drug });
  }

  minimumDailyDoseChangeHandler(event) {
    const { drug } = this.state;
    drug.minimumDailyDose = event.target.value;
    this.setState({ drug });
  }

  maximumDailyDoseChangeHandler(event) {
    const { drug } = this.state;
    drug.maximumDailyDose = event.target.value;
    this.setState({ drug });
  }

  retireReasonChangeHandler(event) {
    const { drug } = this.state;
    drug.retireReason = event.target.value;
    this.setState({ drug });
  }

  submitDrugFormHandler() {
    const { drug, drugId } = this.state;
    if (drug.name === "" || drug.conceptId === "")
      this.setState({ error: true });
    else {
      if (drugId === "add") {
        postDrug(drug)
          .then(() => {
            this.setState({ redirect: "/drug/view/all" });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        putDrugById(drugId, drug)
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
      putDrugById(drugId, drug)
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
      nameChangeHandler,
      conceptIdChangeHandler,
      filterOptions,
      combinationChangeHandler,
      dosageFormChangeHandler,
      strengthChangeHandler,
      minimumDailyDoseChangeHandler,
      maximumDailyDoseChangeHandler,
      retireReasonChangeHandler,
      unretireDrug,
      submitDrugFormHandler,
      cancelButtonHandler,
      retireDrug,
      deleteDrug,
      getValueFor,
    } = this;

    const { drug, redirect, drugId, options, isLoading, error } = this.state;

    const getDefaultConceptIdValue = options.filter(
      (option) => option.value === drug.conceptId
    );

    const getDefaultDosageFormValue = options.filter(
      (option) => option.value === drug.dosageForm
    );

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    if (!isLoading || drugId === "add") {
      return (
        <React.Fragment>
          {error && <p>Fill the required fields</p>}
          <p>Concept Drug Management</p>
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
            <label htmlFor="name" style={labelStyle}>
              Name*:
              <input
                style={inputStyle}
                type="text"
                id="name"
                name="name"
                onChange={nameChangeHandler.bind(this)}
                value={getValueFor(drug.name)}
              />
            </label>
            <br />

            <label htmlFor="conceptId" style={labelStyle}>
              Concept*:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  style={inputStyle}
                  id="conceptId"
                  name="conceptId"
                  placeholder="Enter concept name or id"
                  defaultValue={getDefaultConceptIdValue}
                  onChange={conceptIdChangeHandler.bind(this)}
                  options={options}
                  filterOption={filterOptions}
                />
              </div>
            </label>

            <br />
            <label htmlFor="combination" style={labelStyle}>
              Combination:
              <input
                type="checkbox"
                id="combination"
                name="combination"
                onChange={combinationChangeHandler.bind(this)}
                checked={getValueFor(drug.combination)}
              />
            </label>
            <br />

            <label htmlFor="dosageForm" style={labelStyle}>
              Dosage Form:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  id="dosageForm"
                  name="dosageForm"
                  placeholder="Enter concept name or id"
                  defaultValue={getDefaultDosageFormValue}
                  onChange={dosageFormChangeHandler.bind(this)}
                  options={options}
                  filterOption={filterOptions}
                />
              </div>
            </label>

            <br />
            <label htmlFor="strength" style={labelStyle}>
              Strength:
              <input
                type="text"
                id="strength"
                name="strength"
                onChange={strengthChangeHandler.bind(this)}
                value={getValueFor(drug.strength)}
              />
            </label>
            <br />

            <label htmlFor="minimumDailyDose" style={labelStyle}>
              Minimum Daily Dose:
              <input
                type="number"
                id="minimumDailyDose"
                name="minimumDailyDose"
                onChange={minimumDailyDoseChangeHandler.bind(this)}
                value={getValueFor(drug.minimumDailyDose)}
                step="any"
              />
            </label>
            <br />

            <label htmlFor="maximumDailyDose" style={labelStyle}>
              Maximum Daily Dose:
              <input
                type="number"
                id="maximumDailyDose"
                name="maximumDailyDose"
                onChange={maximumDailyDoseChangeHandler.bind(this)}
                value={getValueFor(drug.maximumDailyDose)}
                step="any"
              />
            </label>
            <br />
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
          </Paper>
          <hr />

          {drugId !== "add" && (
            <div>
              <p>Retire this Drug</p>
              <label htmlFor="retireReason">Reason: </label>
              <input
                type="text"
                id="retireReason"
                name="retireReason"
                onChange={retireReasonChangeHandler.bind(this)}
                value={getValueFor(drug.retireReason)}
              />
              <br />
              <button type="button" onClick={retireDrug.bind(this)}>
                Retire this Drug
              </button>

              <hr />

              <p>Permanently Delete Concept Drug</p>
              <br />
              <button type="button" onClick={deleteDrug.bind(this)}>
                Permanently Delete Concept Drug
              </button>
            </div>
          )}
        </React.Fragment>
      );
    }

    return <p>Loading...</p>;
  }
}

export default withRouter(DrugForm);
