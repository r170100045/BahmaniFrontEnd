import {
  CONCEPT_COMPLEX_HANDLERS,
  FILTER_OPTIONS,
} from "../../constants/otherConstants";
import React, { Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";
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

import Select from "react-select";
import { getDrugs } from "../../services/drugService";
import { Paper, TextField } from "@material-ui/core";
import { conceptPaperStyle, paperStyle } from "../../constants/formStyling";

class ConceptForm extends React.Component {
  constructor(props) {
    super(props);
    const initialConceptState = {
      shortName: "",
      description: "",
      isSet: false,
      version: null,
      classId: 1,
      retired: false,
      retireReason: "",
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
      dataTypeId: {
        conceptDataTypeId: 1,
      },
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
      conceptAnswers: [
        {
          answerDrug: 20,
        },
        {
          answerConcept: 55,
        },
        {
          answerConcept: 40,
        },
        {
          answerDrug: 2,
        },
      ],
      conceptComplex: "",
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
      conceptSets: [{ conceptId: 4 }, { conceptId: 5 }],
    };

    this.state = {
      concept: initialConceptState,
      redirect: null,
      conceptId: this.props.match.params.id,
      dataType: 1,
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
      isLoading: true,
    };

    this.removeSynonymButtonHandler =
      this.removeSynonymButtonHandler.bind(this);
    this.synonymNameChangeHandler = this.synonymNameChangeHandler.bind(this);
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
      .then(() => Promise.all([this.setDataType(), this.setSynonyms()]))
      .then(() => this.setState({ isLoading: false }));
  }

  mergeConceptnames() {
    const { synonyms, concept } = this.state;
    const fullySpecifiedName = concept.conceptNames.find(
      (item) => item.conceptNameType === "FULLY_SPECIFIED"
    );
    const syns = synonyms.filter((item) => item.name.trim() !== "");

    concept.conceptNames = [fullySpecifiedName, ...syns];
    this.setState({ concept });
  }

  getValueFor(field) {
    return field === null ? "" : field;
  }

  collectCodedInfo = (conceptAnswers) => {
    const { concept } = this.state;
    concept.conceptAnswers = conceptAnswers;
    this.setState({ concept });
  };

  collectConceptNumericInfo = (conceptNumeric) => {
    const { concept } = this.state;
    concept.conceptNumeric = conceptNumeric;
    this.setState({ concept });
  };

  isSetChangeHandler(event) {
    const { concept } = this.state;
    concept.isSet = event.target.checked;
    this.setState({ concept });
  }

  unretire(event) {
    event.preventDefault();
    const { concept, conceptId } = this.state;
    concept.retired = false;
    this.setState({ concept: concept }, () => {
      updateConceptById(conceptId, concept)
        .then()
        .catch((error) => console.log(error));
    });
  }

  shortNameChangeHandler(event) {
    const { concept } = this.state;
    concept.shortName = event.target.value;
    this.setState({ concept: concept });
  }

  descriptionChangeHandler(event) {
    const { concept } = this.state;
    concept.description = event.target.value;
    this.setState({ concept: concept });
  }

  versionChangeHandler(event) {
    const { concept } = this.state;
    concept.version = event.target.value;
    this.setState({ concept: concept });
  }

  saveConcept(event) {
    event.preventDefault();
    this.mergeConceptnames();

    const { conceptId, concept } = this.state;
    console.log("concept - save", concept);

    // if (conceptId === "add") {
    //   insertConcept(concept)
    //     .then(() => {
    //       this.setState({ redirect: "/concept/view/all" });
    //     })
    //     .catch((error) => console.log(error));
    // } else {
    //   updateConceptById(conceptId, concept)
    //     .then(() => {
    //       this.setState({ redirect: "/concept/view/all" });
    //     })
    //     .catch((error) => console.log(error));
    // }
  }

  saveConceptAndContinue(event) {
    event.preventDefault();
    this.mergeConceptnames();

    const { conceptId, concept } = this.state;
    if (conceptId === "add") {
      insertConcept(concept)
        .then((response) => {
          this.setState({ conceptId: response.data.name });
        })
        .catch((error) => console.log(error));
    } else {
      updateConceptById(conceptId, concept)
        .then()
        .catch((error) => console.log(error));
    }
  }

  cancelConcept(event) {
    event.preventDefault();
    this.setState({ redirect: "/concept/view/all" });
  }

  deleteConcept(event) {
    event.preventDefault();
    const { conceptId } = this.state;
    deleteConceptById(conceptId)
      .then(() => {
        this.setState({ redirect: "/concept/view/all" });
      })
      .catch((error) => console.log(error));
  }

  retireReasonChangeHandler(event) {
    const { concept } = this.state;
    concept.retireReason = event.target.value;
    this.setState({ concept: concept });
  }

  retireConcept(event) {
    event.preventDefault();
    const { concept, conceptId } = this.state;
    concept.retired = true;
    this.setState({ concept: concept }, () => {
      updateConceptById(conceptId, concept)
        .then()
        .catch((error) => console.log(error));
    });
  }

  classIdChangeHandler(selectedOption) {
    const { concept } = this.state;
    concept.classId = selectedOption.value;
    this.setState({ concept });
  }

  dataTypeChangeHandler(selectedOption) {
    const { concept } = this.state;
    concept.dataTypeId.conceptDataTypeId = selectedOption.value;

    if (selectedOption.value === 1) {
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
    } else if (selectedOption.value === 13) {
      concept.conceptComplex = null;
    } else if (selectedOption.value === 2) {
      concept.conceptAnswers = [];
    }

    this.setState({ concept }, () => {
      this.setDataType();
    });
  }

  conceptComplexChangeHandler(selectedOption) {
    const { concept } = this.state;
    concept.conceptComplex = selectedOption.value;
    this.setState({ concept });
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
            resolve("success");
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
            resolve("success");
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
            resolve("success");
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
            resolve("success");
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
            resolve("success");
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
            resolve("success");
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
              resolve("success");
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
        resolve("success");
      });
    });
  }

  setDataType() {
    const { concept } = this.state;

    return new Promise((resolve) => {
      this.setState({ dataType: concept.dataTypeId.conceptDataTypeId }, () =>
        resolve("success")
      );
    });
  }

  setFetchedConcept() {
    const { conceptId } = this.state;
    return new Promise((resolve, reject) => {
      if (conceptId !== "add") {
        getConceptById(conceptId)
          .then((response) => {
            console.log(response.data);
            this.setState({ concept: response.data }, () => resolve("success"));
          })
          .catch((e) => reject(e));
      } else {
        resolve("success");
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
      this.setState({ synonyms }, () => resolve("success"));
    });
  }

  answerConceptChangeHandler(selectedOptions) {
    const { conceptAnswers } = this.state.concept;
    const answerDrugs = [];
    conceptAnswers.forEach((concept) => {
      if (concept.answerDrug) {
        answerDrugs.push(concept);
      }
    });

    const answerConcepts = [];
    if (selectedOptions !== null) {
      selectedOptions.forEach((option) => {
        const found = answerConcepts.some(
          (answerConcept) => answerConcept.answerConcept === option.value
        );
        if (!found) answerConcepts.push({ answerConcept: option.value });
      });
    }

    const newConceptAnswers = [...answerDrugs, ...answerConcepts];

    const { concept } = this.state;
    concept.conceptAnswers = newConceptAnswers;
    this.setState({ concept });
  }

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

  answerDrugChangeHandler(selectedOptions) {
    const { conceptAnswers } = this.state.concept;
    const answerConcepts = [];
    conceptAnswers.forEach((concept) => {
      if (concept.answerConcept) {
        answerConcepts.push(concept);
      }
    });

    const answerDrugs = [];

    if (selectedOptions !== null) {
      selectedOptions.forEach((option) => {
        const found = answerDrugs.some(
          (answerDrug) => answerDrug.answerDrug === option.value
        );
        if (!found) answerDrugs.push({ answerDrug: option.value });
      });
    }

    const newDrugAnswers = [...answerDrugs, ...answerConcepts];

    const { concept } = this.state;
    concept.conceptAnswers = newDrugAnswers;
    this.setState({ concept });
  }

  getDefaultAnswerConceptValue() {
    const { conceptAnswers } = this.state.concept;
    const { conceptOptions } = this.state;

    let defaultAnswerConceptValue = [];
    conceptAnswers.forEach((concept) => {
      if (concept.answerConcept) {
        const eachValueOptions = conceptOptions.filter(
          (conceptOption) => conceptOption.value === concept.answerConcept
        );
        defaultAnswerConceptValue = [
          ...defaultAnswerConceptValue,
          ...eachValueOptions,
        ];
      }
    });
    console.log("getDACV", defaultAnswerConceptValue);
    return defaultAnswerConceptValue;
  }

  getDefaultAnswerDrugValue() {
    const { conceptAnswers } = this.state.concept;
    const { drugOptions } = this.state;

    let defaultAnswerDrugValue = [];
    conceptAnswers.forEach((concept) => {
      if (concept.answerDrug) {
        const eachValueOptions = drugOptions.filter(
          (drugOption) => drugOption.value === concept.answerDrug
        );
        defaultAnswerDrugValue = [
          ...defaultAnswerDrugValue,
          ...eachValueOptions,
        ];
      }
    });
    return defaultAnswerDrugValue;
  }

  conceptSetsChangeHandler(selectedOptions) {
    const conceptSets = [];
    selectedOptions.forEach((option) => {
      const found = conceptSets.some(
        (conceptSet) => conceptSet.conceptId === option.value
      );
      if (!found) conceptSets.push({ conceptId: option.value });
    });
    const { concept } = this.state;
    concept.conceptSets = conceptSets;
    this.setState({ concept });
  }

  numericChangeHandler = (event, name, type = "value") => {
    const { concept } = this.state;
    concept.conceptNumeric[name] = event.target[type];
    this.setState({ concept });
  };

  fullySpecifiedNameChangeHandler(event) {
    const { concept } = this.state;
    const fullySpecifiedNameIndex = concept.conceptNames.findIndex(
      (item) => item.conceptNameType === "FULLY_SPECIFIED"
    );
    concept.conceptNames[fullySpecifiedNameIndex].name = event.target.value;
    this.setState({ concept });
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
      unretire,
      shortNameChangeHandler,
      descriptionChangeHandler,
      saveConcept,
      saveConceptAndContinue,
      cancelConcept,
      deleteConcept,
      retireReasonChangeHandler,
      retireConcept,
      classIdChangeHandler,
      dataTypeChangeHandler,
      versionChangeHandler,
      conceptComplexChangeHandler,
      isSetChangeHandler,
      getValueFor,
      conceptSetsChangeHandler,
      // getDefaultAnswerConceptValue,
      // getDefaultAnswerDrugValue,
      answerConceptChangeHandler,
      answerDrugChangeHandler,
      fullySpecifiedNameChangeHandler,
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
      redirect,
      conceptId,
      classOptions,
      conceptOptions,
      drugOptions,
      dataTypeOptions,
      mapSourceOptions,
      isLoading,
      synonyms,
      mapRelationshipOptions,
      dataType,
      mapCodeOptions,
    } = this.state;

    const { conceptNumeric, conceptNames, mappings } = concept;

    const getFullySpecifiedName = () => {
      const fullySpecifiedNameObject = conceptNames.find(
        (item) => item.conceptNameType === "FULLY_SPECIFIED"
      );
      return fullySpecifiedNameObject.name;
    };
    const fullySpecifiedName = getFullySpecifiedName();

    const getDefaultDataTypeValue = dataTypeOptions.filter(
      (dataTypeOption) => dataTypeOption.value === dataType
    );

    const getDefaultClassIdValue = classOptions.filter(
      (classOption) => classOption.value === concept.classId
    );

    const getDefaultConceptComplexValue = CONCEPT_COMPLEX_HANDLERS.filter(
      (conceptComplexHandler) =>
        conceptComplexHandler.value === concept.conceptComplex
    );

    const getDefaultConceptSetsValue = () => {
      const { conceptSets } = this.state.concept;
      const { conceptOptions } = this.state;

      let defaultConceptSetsValue = [];
      conceptSets.forEach((concept) => {
        const eachValueOptions = conceptOptions.filter(
          (conceptOption) => conceptOption.value === concept.conceptId
        );
        defaultConceptSetsValue = [
          ...defaultConceptSetsValue,
          ...eachValueOptions,
        ];
      });
      return defaultConceptSetsValue;
    };
    const defaultConceptSetsValue = getDefaultConceptSetsValue();

    const getDefaultAnswerConceptValue = () => {
      const { conceptAnswers } = this.state.concept;
      const { conceptOptions } = this.state;

      let defaultAnswerConceptValue = [];
      conceptAnswers.forEach((concept) => {
        if (concept.answerConcept) {
          const eachValueOptions = conceptOptions.filter(
            (conceptOption) => conceptOption.value === concept.answerConcept
          );
          defaultAnswerConceptValue = [
            ...defaultAnswerConceptValue,
            ...eachValueOptions,
          ];
        }
      });
      return defaultAnswerConceptValue;
    };
    const defaultAnswerConceptValue = getDefaultAnswerConceptValue();

    const getDefaultAnswerDrugValue = () => {
      const { conceptAnswers } = this.state.concept;
      const { drugOptions } = this.state;

      let defaultAnswerDrugValue = [];
      conceptAnswers.forEach((concept) => {
        if (concept.answerDrug) {
          const eachValueOptions = drugOptions.filter(
            (drugOption) => drugOption.value === concept.answerDrug
          );
          defaultAnswerDrugValue = [
            ...defaultAnswerDrugValue,
            ...eachValueOptions,
          ];
        }
      });
      return defaultAnswerDrugValue;
    };
    const defaultAnswerDrugValue = getDefaultAnswerDrugValue();

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (conceptId === "add") {
      return (
        <Paper style={conceptPaperStyle}>
          {conceptId !== "add" && (
            <button type="button">
              <a href={`/concept/view/${conceptId}`}>View</a>
            </button>
          )}
          {conceptId !== "add" && concept.retired && (
            <div>
              <p>
                This concept is retired by (user) (retiredDate) - Retired from
                user interface
              </p>
              <button type="button" onClick={unretire.bind(this)}>
                Unretire
              </button>
            </div>
          )}

          <form>
            <label>Mappings:</label>
            <div>
              <button
                type="button"
                onClick={addMappingButtonHandler.bind(this)}
              >
                Add Mapping
              </button>
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
                  <input
                    name="name"
                    type="name"
                    id="name"
                    value={item.name}
                    onChange={(e) => synonymNameChangeHandler(e, index)}
                  />
                  <button
                    type="button"
                    onClick={() => removeMappingButtonHandler(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <br />

            <TextField
              label="Fully Specified Name"
              type="text"
              id="fullySpecifiedName"
              name="fullySpecifiedName"
              onChange={fullySpecifiedNameChangeHandler.bind(this)}
              value={getValueFor(fullySpecifiedName)}
            />
            <br />

            <label>Synonyms:</label>
            <div>
              <button
                type="button"
                onClick={addSynonymButtonHandler.bind(this)}
              >
                Add Synonym
              </button>
            </div>
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
                  <button
                    type="button"
                    onClick={() => removeSynonymButtonHandler(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <br />

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

            <br />

            <TextField
              label="Short Name"
              type="text"
              id="shortName"
              name="shortName"
              onChange={shortNameChangeHandler.bind(this)}
              value={getValueFor(concept.shortName)}
            />
            <br />

            <TextField
              label="Description"
              type="text"
              id="description"
              name="description"
              onChange={descriptionChangeHandler.bind(this)}
              value={getValueFor(concept.description)}
            />
            <br />

            <label htmlFor="classId">
              Class:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  id="classId"
                  name="classId"
                  defaultValue={
                    concept.classId === 1
                      ? { label: "Test", value: 1 }
                      : getDefaultClassIdValue
                  }
                  onChange={classIdChangeHandler.bind(this)}
                  options={classOptions}
                />
              </div>
            </label>
            <br />

            <label htmlFor="isSet">
              Is Set:
              <input
                type="checkbox"
                id="isSet"
                name="isSet"
                onChange={isSetChangeHandler.bind(this)}
                checked={getValueFor(concept.isSet)}
              />
            </label>
            <br />

            {concept.isSet && (
              <div>
                <label htmlFor="conceptSets">
                  Set Members:
                  <div style={{ width: "500px", display: "inline-block" }}>
                    <Select
                      isMulti
                      id="conceptSets"
                      name="conceptSets"
                      defaultValue={defaultConceptSetsValue}
                      onChange={conceptSetsChangeHandler.bind(this)}
                      options={conceptOptions}
                    />
                  </div>
                </label>
                <br />
              </div>
            )}

            <label htmlFor="dataType">
              Datatype:
              <div style={{ width: "300px", display: "inline-block" }}>
                <Select
                  id="dataType"
                  name="dataType"
                  defaultValue={
                    dataType === 1
                      ? { label: "Numeric", value: 1 }
                      : getDefaultDataTypeValue
                  }
                  onChange={dataTypeChangeHandler.bind(this)}
                  options={dataTypeOptions}
                />
              </div>
            </label>
            <br />

            {dataType === 1 && (
              <div>
                <p>Numeric</p>
                <label htmlFor="hiAbsolute">
                  Absolute High
                  <input
                    type="text"
                    id="hiAbsolute"
                    name="hiAbsolute"
                    value={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.hiAbsolute
                    )}
                    onChange={(e) => numericChangeHandler(e, "hiAbsolute")}
                  />
                </label>
                <br />

                <label htmlFor="hiCritical">
                  Critical High
                  <input
                    type="text"
                    id="hiCritical"
                    name="hiCritical"
                    value={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.hiCritical
                    )}
                    onChange={(e) => numericChangeHandler(e, "hiCritical")}
                  />
                </label>
                <br />

                <label htmlFor="hiNormal">
                  Normal High
                  <input
                    type="text"
                    id="hiNormal"
                    name="hiNormal"
                    value={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.hiNormal
                    )}
                    onChange={(e) => numericChangeHandler(e, "hiNormal")}
                  />
                </label>
                <br />

                <label htmlFor="lowAbsolute">
                  Absolute Low
                  <input
                    type="text"
                    id="lowAbsolute"
                    name="lowAbsolute"
                    value={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.lowAbsolute
                    )}
                    onChange={(e) => numericChangeHandler(e, "lowAbsolute")}
                  />
                </label>
                <br />

                <label htmlFor="lowCritical">
                  Critical Low
                  <input
                    type="text"
                    id="lowCritical"
                    name="lowCritical"
                    value={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.lowCritical
                    )}
                    onChange={(e) => numericChangeHandler(e, "lowCritical")}
                  />
                </label>
                <br />

                <label htmlFor="lowNormal">
                  Normal Low
                  <input
                    type="text"
                    id="lowNormal"
                    name="lowNormal"
                    value={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.lowNormal
                    )}
                    onChange={(e) => numericChangeHandler(e, "lowNormal")}
                  />
                </label>
                <br />

                <label htmlFor="units">
                  Units
                  <input
                    type="text"
                    id="units"
                    name="units"
                    value={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.units
                    )}
                    onChange={(e) => numericChangeHandler(e, "units")}
                  />
                </label>
                <br />

                <label htmlFor="precise">
                  Allow Decimal?
                  <input
                    type="checkbox"
                    id="precise"
                    name="precise"
                    checked={getValueFor(
                      conceptNumeric === null ? "" : conceptNumeric.precise
                    )}
                    onChange={(e) =>
                      numericChangeHandler(e, "precise", "checked")
                    }
                  />
                </label>
                <br />

                <label htmlFor="displayPrecision">
                  Display Precision
                  <input
                    type="text"
                    id="displayPrecision"
                    name="displayPrecision"
                    value={getValueFor(
                      conceptNumeric === null
                        ? ""
                        : conceptNumeric.displayPrecision
                    )}
                    readOnly="true"
                    disabled="true"
                  />
                </label>
                <br />
              </div>
            )}

            {dataType === 2 && (
              <div>
                <p>Answers</p>

                <label htmlFor="answerConcept">Select Concepts: </label>
                <div style={{ width: "80%", display: "inline-block" }}>
                  <Select
                    isMulti
                    id="answerConcept"
                    name="answerConcept"
                    placeholder="Enter concept name or id"
                    // defaultValue={() => getDefaultAnswerConceptValue.bind(this)}
                    defaultValue={defaultAnswerConceptValue}
                    onChange={answerConceptChangeHandler.bind(this)}
                    options={conceptOptions}
                    filterOption={FILTER_OPTIONS}
                  />
                </div>
                <br />

                <label htmlFor="answerDrug">Select Concept Drugs: </label>
                <div style={{ width: "80%", display: "inline-block" }}>
                  <Select
                    isMulti
                    id="answerDrug"
                    name="answerDrug"
                    placeholder="Enter concept drug name or id"
                    // defaultValue={() => getDefaultAnswerDrugValue.bind(this)}
                    defaultValue={defaultAnswerDrugValue}
                    onChange={answerDrugChangeHandler.bind(this)}
                    options={drugOptions}
                    filterOption={FILTER_OPTIONS}
                  />
                </div>
                <br />
              </div>
            )}

            {dataType === 13 && (
              <div>
                <label htmlFor="conceptComplexHandler">
                  Handler:
                  <div style={{ width: "300px", display: "inline-block" }}>
                    <Select
                      id="conceptComplex"
                      name="conceptComplex"
                      defaultValue={getDefaultConceptComplexValue}
                      onChange={conceptComplexChangeHandler.bind(this)}
                      options={CONCEPT_COMPLEX_HANDLERS}
                    />
                  </div>
                </label>
              </div>
            )}

            <TextField
              label="Version"
              type="text"
              id="version"
              name="version"
              onChange={versionChangeHandler.bind(this)}
              value={getValueFor(concept.version)}
            />
            <br />

            <button type="button" onClick={saveConcept.bind(this)}>
              Save Concept
            </button>
            <button type="button" onClick={saveConceptAndContinue.bind(this)}>
              Save and Continue
            </button>
            <button type="button" onClick={cancelConcept.bind(this)}>
              Cancel
            </button>
            {conceptId !== "add" && (
              <button type="button" onClick={deleteConcept.bind(this)}>
                Delete
              </button>
            )}
          </form>

          {conceptId !== "add" && !concept.retired && (
            <div>
              <hr />
              <p>Retire Concept</p>
              <label htmlFor="retireReason">
                Reason:
                <input
                  type="text"
                  id="retireReason"
                  name="retireReason"
                  onChange={retireReasonChangeHandler.bind(this)}
                  value={getValueFor(concept.retireReason)}
                />
              </label>
              <br />

              <button type="button" onClick={retireConcept.bind(this)}>
                Retire
              </button>
            </div>
          )}
        </Paper>
      );
    }
    return <p>Loading...</p>;
  }
}

export default withRouter(ConceptForm);
