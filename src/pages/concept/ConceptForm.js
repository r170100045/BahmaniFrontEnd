import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import {
  CONCEPT_COMPLEX_HANDLERS,
  FILTER_OPTIONS,
  GET_VALUE,
} from "../../constants/otherConstants";
import { MultipleSelect, SingleSelect } from "react-select-material-ui";
import React, { Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  checkboxLabelStyle,
  conceptPaperStyle,
  deleteButtonStyle,
  inputStyle,
  paperStyle,
  subHeadingStyle,
} from "../../constants/formStyling";
import {
  deleteConceptById,
  getConceptById,
  getConceptClasses,
  getConceptDataTypes,
  getConceptMapTypes,
  getConceptNameDetails,
  getConceptReferenceSources,
  getConceptReferenceTerms,
  insertConcept,
  updateConceptById,
} from "../../services/conceptService";

import Controls from "../../components/controls/Controls";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
import Select from "react-select";
import SuccessMessage from "../../utils/SuccessMessage";
import { getDrugs } from "../../services/drugService";

class ConceptForm extends React.Component {
  constructor(props) {
    super(props);
    const initialConceptState = {
      conceptNames: [
        {
          name: "",
          conceptNameType: "FULLY_SPECIFIED",
        },
        {
          name: "",
          conceptNameType: "",
        },
      ],
      shortName: "",
      description: "",
      classId: 1,
      isSet: false,
      conceptSets: [4, 5],
      dataTypeId: 1,
      conceptNumeric: {
        hiAbsolute: null,
        hiCritical: null,
        hiNormal: null,
        lowAbsolute: null,
        lowCritical: null,
        lowNormal: null,
        units: null,
        precise: false,
        displayPrecision: null,
      },
      conceptAnswersDrugs: [20, 2],
      conceptAnswersConcepts: [55, 40],
      conceptComplex: null,
      mappings: [
        {
          conceptReferenceTermId: null,
          conceptMapTypeId: 2,
        },
        // {
        //   conceptReferenceTermId: 4,
        //   conceptMapTypeId: 33
        // }
      ],
      version: null,
      retireReason: "",
      retired: false,
    };

    this.state = {
      concept: initialConceptState,
      conceptId: this.props.match.params.id,
      classOptions: [],
      conceptOptions: [],
      drugOptions: [],
      dataTypeOptions: [],
      mapRelationshipOptions: [],
      mapSourceOptions: [],
      mapReferenceTermOptions: [],
      filteredMapReferenceTermOptions: [],
      mapCodeOptions: [],
      synonyms: initialConceptState.conceptNames.filter(
        (item) => item.conceptNameType !== "FULLY_SPECIFIED"
      ),
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

    this.viewAll = "/concept/view/all";

    // this.saveConceptAndContinue = this.saveConceptAndContinue.bind(this);
    this.saveConcept = this.saveConcept.bind(this);
    this.retireConcept = this.retireConcept.bind(this);
    this.unretireConcept = this.unretireConcept.bind(this);
    this.cancelConcept = this.cancelConcept.bind(this);
    this.deleteConcept = this.deleteConcept.bind(this);
    this.redirectToViewPage = this.redirectToViewPage.bind(this);
    this.conceptChangeHandler = this.conceptChangeHandler.bind(this);
    this.fullySpecifiedNameChangeHandler =
      this.fullySpecifiedNameChangeHandler.bind(this);
    this.conceptSelectTypeInputChangehandler =
      this.conceptSelectTypeInputChangehandler.bind(this);
    this.synonymNameChangeHandler = this.synonymNameChangeHandler.bind(this);
    this.addSynonymButtonHandler = this.addSynonymButtonHandler.bind(this);
    this.removeSynonymButtonHandler =
      this.removeSynonymButtonHandler.bind(this);
    this.numericChangeHandler = this.numericChangeHandler.bind(this);
    this.addMappingButtonHandler = this.addMappingButtonHandler.bind(this);
    this.removeMappingButtonHandler =
      this.removeMappingButtonHandler.bind(this);
    this.conceptMapTypeIdChangeHandler =
      this.conceptMapTypeIdChangeHandler.bind(this);
    this.getDefaultConceptMapTypeId =
      this.getDefaultConceptMapTypeId.bind(this);
    this.conceptSourceIdChangeHandler =
      this.conceptSourceIdChangeHandler.bind(this);
    this.mapCodeChangeHandler = this.mapCodeChangeHandler.bind(this);
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

  validate(concept) {
    return new Promise((resolve) => {
      this.resetErrorsToFalse().then(() => {
        const { errors } = this.state;
        let error = false;

        const fullySpecifiedNameIndex = concept.conceptNames.findIndex(
          (item) => item.conceptNameType === "FULLY_SPECIFIED"
        );
        const fullySpecifiedName =
          concept.conceptNames[fullySpecifiedNameIndex].name;

        if (!this.nonEmpty(fullySpecifiedName)) {
          error = true;
          errors.nameHasError = true;
        }

        if (concept.retired) {
          if (!this.nonEmpty(concept.retireReason)) {
            error = true;
            errors.retireReasonHasError = true;
            concept.retired = false;
          }
        }

        this.setState({ error, errors, concept }, () => {
          resolve();
        });
      });
    });
  }
  // error validation ends

  // component mount starts
  componentDidMount() {
    Promise.all([
      this.setClassOptions(),
      this.setConceptOptions(),
      this.setDrugOptions(),
      this.setDataTypeOptions(),
      this.setMapRelationshipOptions(),
      this.setMapSourceOptions(),
      this.setMapReferenceTermOptions(),
      this.setFilteredMapReferenceTermOptions(),
      this.setMapCodeOptions(),
    ])
      .then(() => this.setFetchedConcept())
      .then(() => this.setSynonyms())
      .then(() => this.setState({ isLoading: false }));
  }

  setClassOptions() {
    return new Promise((resolve, reject) => {
      getConceptClasses()
        .then((response) => {
          const classOptions = [];
          Object.keys(response.data).forEach((key) => {
            classOptions.push({
              label: response.data[key].name,
              value: response.data[key].conceptClassId,
            });
          });
          this.setState({ classOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
  }

  setConceptOptions() {
    return new Promise((resolve, reject) => {
      getConceptNameDetails()
        .then((response) => {
          const conceptOptions = [];
          Object.keys(response.data).forEach((key) => {
            conceptOptions.push({
              label: response.data[key].conceptName,
              value: response.data[key].conceptId,
              uuid: response.data[key].uuid,
            });
          });
          return conceptOptions;
        })
        .then((conceptOptions) => {
          this.setState({ conceptOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
  }

  setDrugOptions() {
    return new Promise((resolve, reject) => {
      getDrugs()
        .then((response) => {
          const drugOptions = [];
          Object.keys(response.data).forEach((key) => {
            drugOptions.push({
              label: response.data[key].name,
              value: response.data[key].drugId,
              conceptUuid: response.data[key].conceptUuid,
            });
          });
          this.setState({ drugOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
  }

  setDataTypeOptions() {
    return new Promise((resolve, reject) => {
      getConceptDataTypes()
        .then((response) => {
          const dataTypeOptions = [];
          Object.keys(response.data).forEach((key) => {
            dataTypeOptions.push({
              label: response.data[key].name,
              value: response.data[key].conceptDatatypeId,
            });
          });
          this.setState({ dataTypeOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
  }

  setMapRelationshipOptions() {
    return new Promise((resolve, reject) => {
      getConceptMapTypes()
        .then((response) => {
          const mapRelationshipOptions = [];
          Object.keys(response.data).forEach((key) => {
            mapRelationshipOptions.push({
              label: response.data[key].name,
              value: response.data[key].conceptMapTypeId,
            });
          });
          this.setState({ mapRelationshipOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
  }

  setMapSourceOptions() {
    return new Promise((resolve, reject) => {
      getConceptReferenceSources()
        .then((response) => {
          const mapSourceOptions = [];
          mapSourceOptions.push({
            label: "Search All Sources",
            value: 0,
          });
          Object.keys(response.data).forEach((key) => {
            mapSourceOptions.push({
              label: response.data[key].name,
              value: response.data[key].conceptSourceId,
            });
          });
          this.setState({ mapSourceOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
  }

  setMapReferenceTermOptions() {
    return new Promise((resolve, reject) => {
      getConceptReferenceTerms()
        .then((response) => {
          this.setState({ mapReferenceTermOptions: response.data }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
  }

  setFilteredMapReferenceTermOptions() {
    return new Promise((resolve, reject) => {
      getConceptReferenceTerms()
        .then((response) => {
          this.setState(
            { filteredMapReferenceTermOptions: response.data },
            () => {
              resolve();
            }
          );
        })
        .catch((e) => reject(e));
    });
  }

  setMapCodeOptions() {
    return new Promise((resolve, reject) => {
      const { filteredMapReferenceTermOptions } = this.state;

      const mapCodeOptions = [];
      filteredMapReferenceTermOptions.forEach((item) => {
        mapCodeOptions.push({
          label: item.conceptSourceId + " " + item.code,
          value: item.conceptReferenceTermId,
        });
      });

      this.setState({ mapCodeOptions }, () => {
        resolve();
      });
    });
  }

  setFetchedConcept() {
    const { conceptId } = this.state;
    return new Promise((resolve, reject) => {
      if (conceptId !== "add") {
        getConceptById(conceptId)
          .then((response) => {
            console.log(response.data);
            this.setState({ concept: response.data }, () => resolve());
          })
          .catch((e) => reject(e));
      } else {
        resolve();
      }
    });
  }

  setSynonyms() {
    const { conceptNames } = this.state.concept;
    return new Promise((resolve) => {
      const synonyms = conceptNames.filter(
        (item) => item.conceptNameType !== ("FULLY_SPECIFIED" || "SHORT")
      );
      if (synonyms.length === 0) {
        synonyms.push({
          name: "",
          conceptNameType: "INDEX_TERM",
        });
      }
      this.setState({ synonyms }, () => resolve());
    });
  }
  // component mount ends

  // save starts
  saveConcept(successMessage = "UPDATED") {
    const { conceptId, concept } = this.state;
    this.validate(concept)
      .then(() => this.mergeConceptnames())
      .then(() => {
        const { error } = this.state;
        if (!error) {
          if (conceptId === "add") this.insertConceptWithData(concept);
          else this.updateConceptWithData(conceptId, concept, successMessage);
        }
      });
  }

  insertConceptWithData(concept) {
    insertConcept(concept)
      .then(() => {
        this.successAndRedirect("SAVED");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("insertConcept", error.message);
      });
  }

  updateConceptWithData(conceptId, concept, successMessage) {
    updateConceptById(conceptId, concept)
      .then(() => {
        this.successAndRedirect(successMessage);
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("updateConceptById", error.message);
      });
  }

  mergeConceptnames() {
    return new Promise((resolve, reject) => {
      const { synonyms, concept } = this.state;
      const fullySpecifiedName = concept.conceptNames.find(
        (item) => item.conceptNameType === "FULLY_SPECIFIED"
      );
      const syns = synonyms.filter((item) => item.name.trim() !== "");
      concept.conceptNames = [fullySpecifiedName, ...syns];

      this.setState({ concept }, () => resolve());
    });
  }
  // save ends

  retireConcept() {
    const { concept } = this.state;
    concept.retired = true;
    this.setState({ concept }, () => {
      this.saveConcept("RETIRED");
    });
  }

  unretireConcept() {
    const { concept } = this.state;
    concept.retireReason = null;
    concept.retired = false;
    this.setState({ concept }, () => {
      this.saveConcept("UN-RETIRED");
    });
  }

  cancelConcept() {
    this.setState({ redirect: this.viewAll });
  }

  deleteConcept() {
    const { conceptId } = this.state;
    deleteConceptById(conceptId)
      .then(() => {
        this.successAndRedirect("DELETED");
      })
      .catch((error) => {
        console.log(error);
        this.setHttpError("deleteConceptById", error.message);
      });
  }

  redirectToViewPage(conceptId) {
    this.setState({ redirect: `/concept/view/${conceptId}` });
  }

  // input change handlers
  conceptChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const { concept } = this.state;
    concept[name] = event.target[type];
    this.setState({ concept });
  };

  conceptSelectTypeInputChangehandler(selectedValues, name) {
    // works for both SingleSelect and MultipleSelect
    const { concept } = this.state;
    concept[name] = selectedValues;

    if (name === "dataTypeId") {
      if (selectedValues === 1 && concept.conceptNumeric === null) {
        concept.conceptNumeric = {
          hiAbsolute: null,
          hiCritical: null,
          hiNormal: null,
          lowAbsolute: null,
          lowCritical: null,
          lowNormal: null,
          units: null,
          precise: false,
          displayPrecision: null,
        };
      } else if (selectedValues === 13 && concept.conceptComplex === null) {
        concept.conceptComplex = "";
      } else if (selectedValues === 2) {
        if (concept.conceptAnswersConcepts === null)
          concept.conceptAnswersConcepts = [];

        if (concept.conceptAnswersDrugs === null)
          concept.conceptAnswersDrugs = [];
      }
    }

    this.setState({ concept });
  }

  fullySpecifiedNameChangeHandler(event) {
    const { concept } = this.state;
    const fullySpecifiedNameIndex = concept.conceptNames.findIndex(
      (item) => item.conceptNameType === "FULLY_SPECIFIED"
    );
    concept.conceptNames[fullySpecifiedNameIndex].name = event.target.value;
    this.setState({ concept });
  }

  addSynonymButtonHandler() {
    const { synonyms } = this.state;
    const syns = [
      ...synonyms,
      {
        name: "",
        conceptNameType: "INDEX_TERM",
      },
    ];
    this.setState({ synonyms: syns });
  }

  synonymNameChangeHandler(event, index) {
    const { synonyms } = this.state;
    const syns = [...synonyms];
    syns[index].name = event.target.value;
    this.setState({ synonyms: syns });
  }

  removeSynonymButtonHandler(index) {
    const { synonyms } = this.state;
    const syns = [...synonyms];
    syns.splice(index, 1);
    this.setState({ synonyms: syns });
  }

  numericChangeHandler = (event, type = "value") => {
    const { name } = event.target;
    const { concept } = this.state;
    concept.conceptNumeric[name] = event.target[type];
    this.setState({ concept });
  };

  // input change handlers ends

  // saveConceptAndContinue(event) {
  //   event.preventDefault();
  //   this.mergeConceptnames();

  //   const { conceptId, concept } = this.state;
  //   if (conceptId === "add") {
  //     insertConcept(concept)
  //       .then((response) => {
  //         this.setState({ conceptId: response.data.name });
  //       })
  //       .catch((error) => console.log(error));
  //   } else {
  //     updateConceptById(conceptId, concept)
  //       .then()
  //       .catch((error) => console.log(error));
  //   }
  // }

  conceptSourceIdChangeHandler(selectedOption, index) {
    const { mapReferenceTermOptions } = this.state;
    if (selectedOption.value === 0) {
      this.setState(
        {
          filteredMapReferenceTermOptions: mapReferenceTermOptions,
        },
        () => {
          this.setMapCodeOptions();
        }
      );
    } else {
      this.setState(
        {
          filteredMapReferenceTermOptions: mapReferenceTermOptions.filter(
            (item) => item.conceptSourceId === selectedOption.value
          ),
        },
        () => {
          this.setMapCodeOptions();
        }
      );
    }
  }

  mapCodeChangeHandler(selectedOption, index) {
    const { concept } = this.state;
    const maps = [...concept.mappings];
    maps[index].conceptMapTypeId = selectedOption.value;
  }

  addMappingButtonHandler() {
    const { concept } = this.state;
    const maps = [...concept.mappings];
    maps.push({
      conceptReferenceTermId: null,
      conceptMapTypeId: null,
    });
    concept.mappings = maps;
    this.setState({ concept });
  }

  removeMappingButtonHandler(index) {
    const { concept } = this.state;
    const maps = [...concept.mappings];
    maps.splice(index, 1);
    concept.mappings = maps;
    this.setState({ concept });
  }

  conceptMapTypeIdChangeHandler(selectedOption, index) {
    const { concept } = this.state;
    concept.mappings[index].conceptMapTypeId = selectedOption.value;
    this.setState({ concept });
  }

  getDefaultConceptMapTypeId(index) {
    const { concept, mapRelationshipOptions } = this.state;
    return mapRelationshipOptions.filter(
      (option) => option.value === concept.mappings[index].conceptMapTypeId
    );
  }

  render() {
    const {
      saveConceptAndContinue,
      saveConcept,
      retireConcept,
      unretireConcept,
      cancelConcept,
      deleteConcept,
      redirectToViewPage,
      conceptChangeHandler,
      fullySpecifiedNameChangeHandler,
      conceptSelectTypeInputChangehandler,
      synonymNameChangeHandler,
      addSynonymButtonHandler,
      removeSynonymButtonHandler,
      numericChangeHandler,

      addMappingButtonHandler,
      removeMappingButtonHandler,
      conceptMapTypeIdChangeHandler,
      getDefaultConceptMapTypeId,
      conceptSourceIdChangeHandler,
      mapCodeChangeHandler,
    } = this;

    const {
      concept,
      conceptId,
      classOptions,
      conceptOptions,
      drugOptions,
      dataTypeOptions,
      mapSourceOptions,
      synonyms,
      mapRelationshipOptions,
      mapCodeOptions,
      redirect,
      isLoading,
      error,
      errors,
      showSuccessMessage,
      successMessage,
    } = this.state;

    const {
      conceptNumeric,
      conceptNames,
      conceptSets,
      mappings,
      dataTypeId,
      conceptAnswersConcepts,
      conceptAnswersDrugs,
    } = concept;

    const getFullySpecifiedName = () => {
      const fullySpecifiedNameObject = conceptNames.find(
        (item) => item.conceptNameType === "FULLY_SPECIFIED"
      );
      return fullySpecifiedNameObject.name;
    };
    const fullySpecifiedName = getFullySpecifiedName();

    if (redirect) return <Redirect to={redirect} />;

    if (showSuccessMessage) return <SuccessMessage action={successMessage} />;

    if (errors.httpRequestHasError)
      return <ErrorLoadingData message={errors.httpRequest} />;

    if (isLoading) return <LoadingData />;

    return (
      <Paper style={paperStyle}>
        {conceptId !== "add" && (
          <button type="button" onClick={() => redirectToViewPage(conceptId)}>
            View
          </button>
        )}

        <form>
          <div>
            <label>Mappings:</label>
            <div>
              <Button
                variant="outlined"
                onClick={addMappingButtonHandler.bind(this)}
              >
                Add Mapping
              </Button>
            </div>
            {mappings.map((item, index) => (
              <div key={index}>
                <div>
                  <div style={{ width: "300px", display: "inline-block" }}>
                    <Select
                      id="conceptMapTypeId"
                      name="conceptMapTypeId"
                      defaultValue={
                        item.conceptMapTypeId === 1
                          ? { label: "SAME-AS", value: 1 }
                          : getDefaultConceptMapTypeId(index)
                      }
                      // defaultValue={() => getDefaultConceptMapTypeId(index)}
                      onChange={(selectedOption) =>
                        conceptMapTypeIdChangeHandler(selectedOption, index)
                      }
                      options={mapRelationshipOptions}
                    />
                  </div>
                  <div style={{ width: "300px", display: "inline-block" }}>
                    <Select
                      id="conceptSourceId"
                      name="conceptSourceId"
                      // defaultValue={() => getDefaultConceptSourceId(index)}

                      onChange={(selectedOption) =>
                        conceptSourceIdChangeHandler(selectedOption, index)
                      }
                      options={mapSourceOptions}
                    />
                  </div>
                  <div style={{ width: "300px", display: "inline-block" }}>
                    <Select
                      id="code"
                      name="code"
                      // defaultValue={() => getDefaultCode(index)}
                      onChange={(selectedOption) =>
                        mapCodeChangeHandler(selectedOption, index)
                      }
                      options={mapCodeOptions}
                    />
                  </div>
                  <TextField
                    name="name"
                    type="name"
                    id="name"
                    value={item.name}
                    onChange={(e) => synonymNameChangeHandler(e, index)}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => removeMappingButtonHandler(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <br />

          <TextField
            label="Fully Specified Name"
            type="text"
            id="fullySpecifiedName"
            name="fullySpecifiedName"
            onChange={(e) => fullySpecifiedNameChangeHandler(e)}
            value={GET_VALUE(fullySpecifiedName)}
          />
          <br />

          <div>
            <label>Synonyms:</label>
            <div>
              <Button
                variant="outlined"
                onClick={() => addSynonymButtonHandler()}
              >
                Add Synonym
              </Button>
            </div>
            {synonyms.map((item, index) => (
              <div key={index}>
                <div>
                  <TextField
                    name="name"
                    type="text"
                    id="name"
                    value={item.name}
                    onChange={(e) => synonymNameChangeHandler(e, index)}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => removeSynonymButtonHandler(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <br />

          <div>
            {/* <label>Synonyms:</label>
            {synonyms.map((item, index) => (
              <div key={index}>
                <div>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    value={item.name}
                    onChange={(e) => synonymNameChangeHandler(e, index)}
                  />
                  {synonyms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSynonymButtonHandler(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  {synonyms.length - 1 === index && (
                    <button
                      type="button"
                      onClick={addSynonymButtonHandler.bind(this)}
                    >
                      Add Synonym
                    </button>
                  )}
                </div>
              </div>
            ))} */}
          </div>
          <br />

          <TextField
            label="Short Name"
            type="text"
            id="shortName"
            name="shortName"
            onChange={(e) => conceptChangeHandler(e)}
            value={GET_VALUE(concept.shortName)}
          />
          <br />

          <TextField
            label="Description"
            type="text"
            id="description"
            name="description"
            onChange={(e) => conceptChangeHandler(e)}
            value={GET_VALUE(concept.description)}
          />
          <br />

          <SingleSelect
            style={inputStyle}
            label="Class"
            id="classId"
            name="classId"
            defaultValue={concept.classId}
            onChange={(selectedValue) =>
              conceptSelectTypeInputChangehandler(selectedValue, "classId")
            }
            options={classOptions}
          />
          <br />

          <FormControlLabel
            control={
              <Checkbox
                type="checkbox"
                id="isSet"
                name="isSet"
                onChange={(e) => conceptChangeHandler(e, "checked")}
                checked={GET_VALUE(concept.isSet)}
              />
            }
            label={<span style={checkboxLabelStyle}>Is set</span>}
          />
          <br />

          {concept.isSet && (
            <div>
              <MultipleSelect
                style={inputStyle}
                label="Set Members"
                id="conceptSets"
                name="conceptSets"
                defaultValues={conceptSets}
                onChange={(selectedValues) =>
                  conceptSelectTypeInputChangehandler(
                    selectedValues,
                    "conceptSets"
                  )
                }
                options={conceptOptions}
              />
            </div>
          )}

          <SingleSelect
            label="Datatype"
            style={inputStyle}
            id="dataTypeId"
            name="dataTypeId"
            defaultValue={dataTypeId}
            onChange={(selectedValue) =>
              conceptSelectTypeInputChangehandler(selectedValue, "dataTypeId")
            }
            options={dataTypeOptions}
          />
          <br />

          {dataTypeId === 1 && (
            <div>
              <p>Numeric</p>
              <TextField
                label="Absolute High"
                type="text"
                id="hiAbsolute"
                name="hiAbsolute"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.hiAbsolute
                )}
                onChange={(e) => numericChangeHandler(e)}
              />
              <br />

              <TextField
                label="Critical High"
                type="text"
                id="hiCritical"
                name="hiCritical"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.hiCritical
                )}
                onChange={(e) => numericChangeHandler(e)}
              />
              <br />
              <TextField
                label="Normal High"
                type="text"
                id="hiNormal"
                name="hiNormal"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.hiNormal
                )}
                onChange={(e) => numericChangeHandler(e)}
              />
              <br />
              <TextField
                label="Absolute Low"
                type="text"
                id="lowAbsolute"
                name="lowAbsolute"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.lowAbsolute
                )}
                onChange={(e) => numericChangeHandler(e)}
              />
              <br />

              <TextField
                label="Critical Low"
                type="text"
                id="lowCritical"
                name="lowCritical"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.lowCritical
                )}
                onChange={(e) => numericChangeHandler(e)}
              />
              <br />

              <TextField
                label="Normal Low"
                type="text"
                id="lowNormal"
                name="lowNormal"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.lowNormal
                )}
                onChange={(e) => numericChangeHandler(e)}
              />
              <br />

              <TextField
                label="Units"
                type="text"
                id="units"
                name="units"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.units
                )}
                onChange={(e) => numericChangeHandler(e)}
              />
              <br />

              <FormControlLabel
                control={
                  <Checkbox
                    type="checkbox"
                    id="precise"
                    name="precise"
                    checked={GET_VALUE(
                      conceptNumeric === null ? "" : conceptNumeric.precise
                    )}
                    onChange={(e) => numericChangeHandler(e, "checked")}
                  />
                }
                label={<span style={checkboxLabelStyle}>Allow Decimal?</span>}
              />
              <br />

              <TextField
                label="Display Precision"
                type="text"
                id="displayPrecision"
                name="displayPrecision"
                value={GET_VALUE(
                  conceptNumeric === null ? "" : conceptNumeric.displayPrecision
                )}
                readOnly="true"
                disabled="true"
              />
              <br />
            </div>
          )}

          {dataTypeId === 2 && (
            <div>
              <p>Answers</p>

              <MultipleSelect
                label="Select Concepts"
                id="conceptAnswersConcepts"
                name="conceptAnswersConcepts"
                placeholder="Enter concept name or id"
                defaultValues={conceptAnswersConcepts}
                onChange={(selectedValues) =>
                  conceptSelectTypeInputChangehandler(
                    selectedValues,
                    "conceptAnswersConcepts"
                  )
                }
                options={conceptOptions}
                filterOption={FILTER_OPTIONS}
              />
              <br />

              <MultipleSelect
                label="Select Drugs"
                id="conceptAnswersDrugs"
                name="conceptAnswersDrugs"
                placeholder="Enter concept drug name or id"
                defaultValues={conceptAnswersDrugs}
                onChange={(selectedValues) =>
                  conceptSelectTypeInputChangehandler(
                    selectedValues,
                    "conceptAnswersDrugs"
                  )
                }
                options={drugOptions}
                filterOption={FILTER_OPTIONS}
              />
            </div>
          )}

          {dataTypeId === 13 && (
            <div>
              <SingleSelect
                label="Handler"
                id="conceptComplex"
                name="conceptComplex"
                defaultValue={GET_VALUE(concept.conceptComplex)}
                onChange={(selectedValue) =>
                  conceptSelectTypeInputChangehandler(
                    selectedValue,
                    "conceptComplex"
                  )
                }
                options={CONCEPT_COMPLEX_HANDLERS}
              />
            </div>
          )}

          <TextField
            style={inputStyle}
            label="Version"
            type="text"
            id="version"
            name="version"
            onChange={(e) => conceptChangeHandler(e)}
            value={GET_VALUE(concept.version)}
          />
          <br />
        </form>
        <Grid container style={{ gridGap: 5 }}>
          <Controls.SaveButton onClick={() => saveConcept()} />
          {/* <Button variant="outlined" onClick={saveConceptAndContinue.bind(this)}>
          Save and Continue
        </Button> */}
          <Controls.CancelButton
            type="button"
            onClick={() => cancelConcept()}
          />
        </Grid>

        {conceptId !== "add" && !concept.retired && (
          <Paper style={paperStyle}>
            <TextField
              style={inputStyle}
              label="Reason to retire"
              type="text"
              id="retireReason"
              name="retireReason"
              multiline
              value={GET_VALUE(concept.retireReason)}
              onChange={(e) => conceptChangeHandler(e)}
            />
            <span>
              {error && errors.retireReasonHasError && errors.retireReason}
            </span>

            <br />
            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={concept.retired}
                onClick={() => retireConcept()}
              />
            </div>

            <br />
          </Paper>
        )}

        {conceptId !== "add" && concept.retired && (
          <Paper style={paperStyle}>
            <p style={subHeadingStyle}>Unretire Concept</p>
            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={concept.retired}
                onClick={() => unretireConcept()}
              />
            </div>
          </Paper>
        )}

        {conceptId !== "add" && (
          <Controls.DeleteButton
            style={deleteButtonStyle}
            onClick={() => deleteConcept()}
          />
        )}
      </Paper>
    );
  }
}

export default withRouter(ConceptForm);
