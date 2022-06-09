import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  globalError,
  inputStyle,
  paperStyle,
  propertyName,
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
  insertReferenceTerm,
  updateConceptById,
} from "../../services/conceptService";

import Controls from "../../components/controls/Controls";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ErrorLoadingData from "../../utils/ErrorLoadingData";
import LoadingData from "../../utils/LoadingData";
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
      conceptAnswerDrugs: [20, 2],
      conceptAnswerConcepts: [55, 40],
      conceptComplex: null,
      mappings: [
        {
          conceptMapTypeId: 1,
          conceptReferenceConceptSourceId: 1,
          conceptReferenceCode: "Confirmed",
          conceptReferenceName: null,
          conceptReferenceTermId: 6,
        },
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
      mapSourceOptionsForReferenceTerm: [],
      mapCodeOptions: [],
      synonyms: initialConceptState.conceptNames.filter(
        (item) => item.conceptNameType !== "FULLY_SPECIFIED"
      ),
      openReferenceTermForm: false,
      referenceTerm: {
        code: null,
        name: null,
        conceptSourceId: null,
      },
      redirect: null,
      isLoading: true,
      showSuccessMessage: false,
      successMessage: null,
      error: false,
      errorReferenceTerm: false,
      errors: {
        globalErrorMessage: "Please fix all errors and try again.",
        httpRequest: null,
        httpRequestHasError: false,
        name: "name can not be empty",
        nameHasError: false,
        retireReason: "reason to retire can not be empty",
        retireReasonHasError: false,
        code: "code can not be empty",
        codeHasError: false,
        conceptSourceId: "source can not be empty",
        conceptSourceIdHasError: false,
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
    this.conceptReferenceConceptSourceIdChangeHandler =
      this.conceptReferenceConceptSourceIdChangeHandler.bind(this);
    this.mapCodeChangeHandler = this.mapCodeChangeHandler.bind(this);
    this.referenceTermChangeHandler =
      this.referenceTermChangeHandler.bind(this);
    this.referenceTermSourceChangeHandler =
      this.referenceTermSourceChangeHandler.bind(this);
    this.closeReferenceTerm = this.closeReferenceTerm.bind(this);
    this.openReferenceTermFormHandler =
      this.openReferenceTermFormHandler.bind(this);
    this.saveReferenceTerm = this.saveReferenceTerm.bind(this);
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
      errors.retireReasonHasError = false;
      this.setState({ errors, error: false }, () => resolve());
    });
  }

  resetReferenceTermErrorsToFalse() {
    return new Promise((resolve) => {
      const { errors } = this.state;
      errors.codeHasError = false;
      errors.conceptSourceIdHasError = false;
      this.setState({ errors, errorReferenceTerm: false }, () => resolve());
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

  validateReferenceTerm(referenceTerm) {
    return new Promise((resolve) => {
      this.resetReferenceTermErrorsToFalse().then(() => {
        console.log("here");
        const { errors } = this.state;
        let errorReferenceTerm = false;

        if (!this.nonEmpty(referenceTerm.code)) {
          errorReferenceTerm = true;
          errors.codeHasError = true;
        }

        if (!this.nonEmptyInteger(referenceTerm.conceptSourceId)) {
          errorReferenceTerm = true;
          errors.conceptSourceIdHasError = true;
        }
        console.log("errorReferenceTermValidate", errorReferenceTerm);
        this.setState({ errorReferenceTerm, errors }, () => {
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
    ])
      .then(() => this.setMapCodeOptions())
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
          const mapSourceOptionsForReferenceTerm = [];
          let mapSourceOptions = [];

          Object.keys(response.data).forEach((key) => {
            mapSourceOptionsForReferenceTerm.push({
              label: response.data[key].name,
              value: response.data[key].conceptSourceId,
            });
          });

          mapSourceOptions = [
            {
              label: "Search All Sources",
              value: 0,
            },
            ...mapSourceOptionsForReferenceTerm,
          ];

          this.setState(
            { mapSourceOptions, mapSourceOptionsForReferenceTerm },
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
      getConceptReferenceTerms()
        .then((response) => {
          const mapReferenceTermOptions = response.data;
          const { mapSourceOptions } = this.state;
          const mapCodeOptions = [];
          const allSourcesMapCodeOptions = [];

          mapSourceOptions.forEach((source) => {
            const mapCodeOptionsForThisSource = [];
            mapReferenceTermOptions.forEach((referenceTermOption) => {
              const newMapCodeOption = {
                label: referenceTermOption.code,
                value: referenceTermOption.code,
                conceptReferenceConceptSourceId:
                  referenceTermOption.conceptSourceId,
                conceptReferenceTermId:
                  referenceTermOption.conceptReferenceTermId,
                name: referenceTermOption.name,
              };

              if (referenceTermOption.conceptSourceId === source.value) {
                mapCodeOptionsForThisSource.push(newMapCodeOption);
              }
              allSourcesMapCodeOptions.push(newMapCodeOption);
            });
            mapCodeOptions.splice(source.value, 0, mapCodeOptionsForThisSource);
          });
          mapCodeOptions.splice(0, 1, allSourcesMapCodeOptions);

          this.setState({ mapCodeOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
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

  modifyConceptForEditRequest(concept) {
    const conceptSetsForEditRequest = [];
    concept.conceptSets.forEach((conceptId) => {
      conceptSetsForEditRequest.push({
        conceptId: conceptId,
      });
    });
    concept.conceptSets = conceptSetsForEditRequest;

    const conceptAnswersForEditRequest = [];
    concept.conceptAnswerDrugs.forEach((answerDrug) => {
      conceptAnswersForEditRequest.push({
        answerDrug: answerDrug,
        answerConcept: null,
      });
    });
    concept.conceptAnswerConcepts.forEach((answerConcept) => {
      conceptAnswersForEditRequest.push({
        answerDrug: null,
        answerConcept: answerConcept,
      });
    });
    concept.conceptAnswers = conceptAnswersForEditRequest;

    const conceptHandlerForEditRequest = { handler: concept.conceptComplex };
    concept.conceptComplex = conceptHandlerForEditRequest;

    const conceptMappingsForEditRequest = [];
    concept.mappings.forEach((mapping) => {
      if (
        mapping.conceptReferenceConceptSourceId !== 0 &&
        mapping.conceptReferenceCode !== null
      ) {
        conceptMappingsForEditRequest.push({
          conceptMapTypeId: mapping.conceptMapTypeId,
          conceptReferenceTermId: mapping.conceptReferenceTermId,
        });
      }
    });
    concept.mappings = conceptMappingsForEditRequest;

    concept.datatypeId = concept.dataTypeId;
    return concept;
  }

  insertConceptWithData(concept) {
    const modifiedConcept = this.modifyConceptForEditRequest(concept);
    console.log("modifiedConcept", modifiedConcept);
    insertConcept(modifiedConcept)
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
        if (concept.conceptAnswerConcepts === null)
          concept.conceptAnswerConcepts = [];

        if (concept.conceptAnswerDrugs === null)
          concept.conceptAnswerDrugs = [];
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

  conceptReferenceConceptSourceIdChangeHandler(selectedValue, index) {
    const { concept } = this.state;
    const mappings = [...concept.mappings];
    mappings[index].conceptReferenceCode = null;
    mappings[index].conceptReferenceName = null;
    mappings[index].conceptReferenceConceptSourceId = selectedValue;
    concept.mappings = mappings;
    this.setState({ concept });
  }

  mapCodeChangeHandler(selctedValue, selectedOption, index) {
    const { conceptReferenceTermId, name } = selectedOption;
    const { concept } = this.state;
    const mappings = [...concept.mappings];
    mappings[index].conceptReferenceCode = selctedValue;
    mappings[index].conceptReferenceTermId = conceptReferenceTermId;
    mappings[index].conceptReferenceName = name;
    concept.mappings = mappings;
    this.setState({ concept });
  }

  addMappingButtonHandler() {
    const { concept } = this.state;
    const mappings = [...concept.mappings];
    mappings.push({
      conceptMapTypeId: 1,
      conceptReferenceConceptSourceId: 0,
      conceptReferenceCode: null,
      conceptReferenceName: null,
      conceptReferenceTermId: null,
    });
    concept.mappings = mappings;
    this.setState({ concept });
  }

  removeMappingButtonHandler(index) {
    const { concept } = this.state;
    const mappings = [...concept.mappings];
    mappings.splice(index, 1);
    concept.mappings = mappings;
    this.setState({ concept });
  }

  conceptMapTypeIdChangeHandler(selectedValue, index) {
    const { concept } = this.state;
    const mappings = [...concept.mappings];
    mappings[index].conceptMapTypeId = selectedValue;
    concept.mappings = mappings;
    this.setState({ concept });
  }

  referenceTermChangeHandler(event) {
    const { name, value } = event.target;
    const { referenceTerm } = this.state;
    referenceTerm[name] = value;
    this.setState({ referenceTerm });
  }

  referenceTermSourceChangeHandler(selectedValue) {
    const { referenceTerm } = this.state;
    referenceTerm.conceptSourceId = selectedValue;
    this.setState({ referenceTerm });
  }

  closeReferenceTerm() {
    this.setState({ openReferenceTermForm: false });
  }

  openReferenceTermFormHandler() {
    this.setState({ openReferenceTermForm: true });
  }

  saveReferenceTerm() {
    const { referenceTerm } = this.state;
    this.validateReferenceTerm(referenceTerm).then(() => {
      const { errorReferenceTerm } = this.state;
      if (!errorReferenceTerm) {
        this.setState({ openReferenceTermForm: false });
        this.insertReferenceTermWithData(referenceTerm);
      }
    });
  }

  insertReferenceTermWithData(referenceTerm) {
    console.log("referenceTerm", referenceTerm);
    this.setState(
      {
        referenceTerm: {
          conceptSourceId: null,
          code: null,
          name: null,
        },
      },
      () => {
        insertReferenceTerm(referenceTerm)
          .then(() => {
            this.setState({
              showSuccessMessage: true,
              successMessage: "SAVED",
            });
          })
          .then(() => this.setState({ isLoading: true }))
          .then(() => this.setMapCodeOptions())
          .then(() => this.setState({ isLoading: false }))
          .then(() =>
            setTimeout(() => {
              this.setState({ showSuccessMessage: false });
            }, 500)
          )
          .catch((error) => {
            console.log(error);
            this.setHttpError("insertReferenceTerm", error.message);
          });
      }
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
      conceptReferenceConceptSourceIdChangeHandler,
      mapCodeChangeHandler,
      referenceTermChangeHandler,
      referenceTermSourceChangeHandler,
      closeReferenceTerm,
      openReferenceTermFormHandler,
      saveReferenceTerm,
    } = this;

    const {
      concept,
      conceptId,
      classOptions,
      conceptOptions,
      drugOptions,
      dataTypeOptions,
      mapSourceOptions,
      mapSourceOptionsForReferenceTerm,
      synonyms,
      mapRelationshipOptions,
      mapCodeOptions,
      openReferenceTermForm,
      referenceTerm,
      redirect,
      isLoading,
      error,
      errorReferenceTerm,
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
      conceptAnswerConcepts,
      conceptAnswerDrugs,
    } = concept;

    const getFullySpecifiedName = () => {
      const fullySpecifiedNameObject = conceptNames.find(
        (item) => item.conceptNameType === "FULLY_SPECIFIED"
      );
      return fullySpecifiedNameObject.name;
    };
    const fullySpecifiedName = getFullySpecifiedName();

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <LoadingData />;

    console.log("conceptBeforeReturn", concept);

    return (
      <Paper style={paperStyle}>
        {errors.httpRequestHasError && (
          <ErrorLoadingData message={errors.httpRequest} />
        )}
        {showSuccessMessage && <SuccessMessage action={successMessage} />}

        {error && <span style={globalError}>{errors.globalErrorMessage}</span>}

        {conceptId !== "add" && (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <div style={buttonGroupStyle}>
              <Button
                style={{ backgroundColor: "#a7b3ee" }}
                variant="outlined"
                type="button"
                size="small"
                onClick={() => redirectToViewPage(conceptId)}
              >
                View
              </Button>
            </div>
          </div>
        )}

        <form>
          <TextField
            style={inputStyle}
            error={errors.nameHasError}
            helperText={errors.nameHasError && errors.name}
            label="Fully Specified Name"
            type="text"
            id="fullySpecifiedName"
            name="fullySpecifiedName"
            onChange={(e) => fullySpecifiedNameChangeHandler(e)}
            value={GET_VALUE(fullySpecifiedName)}
          />

          <div>
            <div style={{ fontSize: "1rem", marginTop: "15px" }}>Synonyms:</div>

            <div style={{ marginLeft: "20px" }}>
              {synonyms.map((item, index) => (
                <div key={index}>
                  <div>
                    <TextField
                      style={inputStyle}
                      name="name"
                      type="text"
                      id="name"
                      value={item.name}
                      onChange={(e) => synonymNameChangeHandler(e, index)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <DeleteIcon
                              style={{ cursor: "pointer", color: "red" }}
                              onClick={() => removeSynonymButtonHandler(index)}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
              <div>
                <Button
                  style={{ marginTop: "10px" }}
                  variant="outlined"
                  size="small"
                  onClick={() => addSynonymButtonHandler()}
                >
                  Add Synonym
                </Button>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              style={inputStyle}
              label="Short Name"
              type="text"
              id="shortName"
              name="shortName"
              onChange={(e) => conceptChangeHandler(e)}
              value={GET_VALUE(concept.shortName)}
            />

            <TextField
              style={inputStyle}
              label="Description"
              type="text"
              id="description"
              name="description"
              onChange={(e) => conceptChangeHandler(e)}
              value={GET_VALUE(concept.description)}
            />

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

            <FormControlLabel
              style={inputStyle}
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

            {concept.isSet && (
              <div style={{ marginLeft: 20 }}>
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
          </div>

          {dataTypeId === 1 && (
            <div>
              <div style={{ fontSize: "1rem", marginTop: "15px" }}>
                Numeric Details
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "20px",
                }}
              >
                <div>
                  <TextField
                    style={inputStyle}
                    label="Absolute High"
                    type="text"
                    id="hiAbsolute"
                    name="hiAbsolute"
                    value={GET_VALUE(
                      conceptNumeric === null ? "" : conceptNumeric.hiAbsolute
                    )}
                    onChange={(e) => numericChangeHandler(e)}
                  />
                </div>

                <TextField
                  style={inputStyle}
                  label="Critical High"
                  type="text"
                  id="hiCritical"
                  name="hiCritical"
                  value={GET_VALUE(
                    conceptNumeric === null ? "" : conceptNumeric.hiCritical
                  )}
                  onChange={(e) => numericChangeHandler(e)}
                />
                <TextField
                  style={inputStyle}
                  label="Normal High"
                  type="text"
                  id="hiNormal"
                  name="hiNormal"
                  value={GET_VALUE(
                    conceptNumeric === null ? "" : conceptNumeric.hiNormal
                  )}
                  onChange={(e) => numericChangeHandler(e)}
                />
                <TextField
                  style={inputStyle}
                  label="Absolute Low"
                  type="text"
                  id="lowAbsolute"
                  name="lowAbsolute"
                  value={GET_VALUE(
                    conceptNumeric === null ? "" : conceptNumeric.lowAbsolute
                  )}
                  onChange={(e) => numericChangeHandler(e)}
                />

                <TextField
                  style={inputStyle}
                  label="Critical Low"
                  type="text"
                  id="lowCritical"
                  name="lowCritical"
                  value={GET_VALUE(
                    conceptNumeric === null ? "" : conceptNumeric.lowCritical
                  )}
                  onChange={(e) => numericChangeHandler(e)}
                />

                <TextField
                  style={inputStyle}
                  label="Normal Low"
                  type="text"
                  id="lowNormal"
                  name="lowNormal"
                  value={GET_VALUE(
                    conceptNumeric === null ? "" : conceptNumeric.lowNormal
                  )}
                  onChange={(e) => numericChangeHandler(e)}
                />

                <TextField
                  style={inputStyle}
                  label="Units"
                  type="text"
                  id="units"
                  name="units"
                  value={GET_VALUE(
                    conceptNumeric === null ? "" : conceptNumeric.units
                  )}
                  onChange={(e) => numericChangeHandler(e)}
                />

                <TextField
                  style={inputStyle}
                  label="Display Precision"
                  type="text"
                  id="displayPrecision"
                  name="displayPrecision"
                  value={GET_VALUE(
                    conceptNumeric === null
                      ? ""
                      : conceptNumeric.displayPrecision
                  )}
                  readOnly="true"
                  disabled="true"
                />
                <FormControlLabel
                  style={inputStyle}
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
              </div>
            </div>
          )}

          {dataTypeId === 2 && (
            <div>
              <div style={{ fontSize: "1rem", marginTop: "15px" }}>
                Coded: Answers
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "20px",
                }}
              >
                <MultipleSelect
                  style={inputStyle}
                  label="Select Concepts"
                  id="conceptAnswerConcepts"
                  name="conceptAnswerConcepts"
                  placeholder="Enter concept name or id"
                  defaultValues={conceptAnswerConcepts}
                  onChange={(selectedValues) =>
                    conceptSelectTypeInputChangehandler(
                      selectedValues,
                      "conceptAnswerConcepts"
                    )
                  }
                  options={conceptOptions}
                  filterOption={FILTER_OPTIONS}
                />

                <MultipleSelect
                  style={inputStyle}
                  label="Select Drugs"
                  id="conceptAnswerDrugs"
                  name="conceptAnswerDrugs"
                  placeholder="Enter concept drug name or id"
                  defaultValues={conceptAnswerDrugs}
                  onChange={(selectedValues) =>
                    conceptSelectTypeInputChangehandler(
                      selectedValues,
                      "conceptAnswerDrugs"
                    )
                  }
                  options={drugOptions}
                  filterOption={FILTER_OPTIONS}
                />
              </div>
            </div>
          )}

          {dataTypeId === 13 && (
            <div style={{ marginLeft: 20 }}>
              <SingleSelect
                style={inputStyle}
                label="Complex Handler"
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

          <div>
            <div style={{ fontSize: "1rem", marginTop: "15px" }}>Mappings:</div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Relationship</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {mappings.map((item, index) => (
                  <TableRow
                    key={
                      index +
                      item.conceptMapTypeId +
                      item.conceptReferenceConceptSourceId +
                      item.conceptReferenceCode +
                      item.conceptReferenceName +
                      item.conceptReferenceTermId
                    }
                  >
                    <TableCell style={{ width: "25%" }}>
                      <SingleSelect
                        id="conceptMapTypeId"
                        name="conceptMapTypeId"
                        defaultValue={GET_VALUE(item.conceptMapTypeId)}
                        onChange={(selectedValue) =>
                          conceptMapTypeIdChangeHandler(selectedValue, index)
                        }
                        options={mapRelationshipOptions}
                      />
                    </TableCell>

                    <TableCell style={{ width: "25%" }}>
                      <SingleSelect
                        id="conceptReferenceConceptSourceId"
                        name="conceptReferenceConceptSourceId"
                        defaultValue={GET_VALUE(
                          item.conceptReferenceConceptSourceId
                        )}
                        onChange={(selectedValue) =>
                          conceptReferenceConceptSourceIdChangeHandler(
                            selectedValue,
                            index
                          )
                        }
                        options={mapSourceOptions}
                      />
                    </TableCell>

                    <TableCell style={{ width: "25%" }}>
                      <SingleSelect
                        id="conceptReferenceCode"
                        name="conceptReferenceCode"
                        defaultValue={GET_VALUE(item.conceptReferenceCode)}
                        onChange={(selectedValue, selectedOption) =>
                          mapCodeChangeHandler(
                            selectedValue,
                            selectedOption,
                            index
                          )
                        }
                        options={
                          mapCodeOptions[item.conceptReferenceConceptSourceId]
                        }
                      />
                    </TableCell>
                    <TableCell style={{ width: "25%" }}>
                      <TextField
                        id="conceptReferenceName"
                        name="conceptReferenceName"
                        value={GET_VALUE(item.conceptReferenceName)}
                        disabled
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <DeleteIcon
                                style={{ cursor: "pointer", color: "red" }}
                                onClick={() =>
                                  removeMappingButtonHandler(index)
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </TableCell>
                    {/* <Button
                    variant="outlined"
                    onClick={() => removeMappingButtonHandler(index)}
                  >
                    Remove
                  </Button> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div>
              <Grid container style={{ gridGap: 5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => addMappingButtonHandler()}
                >
                  Add New Mapping
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openReferenceTermFormHandler()}
                >
                  Create New Reference Term
                </Button>
              </Grid>
            </div>

            <Dialog
              open={openReferenceTermForm}
              onClose={() => closeReferenceTerm()}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Create New Reference Term
              </DialogTitle>
              <DialogContent>
                <DialogContentText>Reference Term Details</DialogContentText>
                {errorReferenceTerm && (
                  <span style={globalError}>{errors.globalErrorMessage}</span>
                )}

                <TextField
                  error={errors.codeHasError}
                  helperText={errors.codeHasError && errors.code}
                  style={inputStyle}
                  label="Code"
                  id="code"
                  name="code"
                  value={GET_VALUE(referenceTerm.code)}
                  onChange={(e) => referenceTermChangeHandler(e)}
                  required
                />
                <SingleSelect
                  error={errors.conceptSourceIdHasError}
                  helperText={
                    errors.conceptSourceIdHasError && errors.conceptSourceId
                  }
                  style={inputStyle}
                  label="Source"
                  id="conceptSourceId"
                  name="conceptSourceId"
                  defaultValue={GET_VALUE(referenceTerm.conceptSourceId)}
                  onChange={(selectedValue) =>
                    referenceTermSourceChangeHandler(selectedValue)
                  }
                  options={mapSourceOptionsForReferenceTerm}
                  required
                />
                <TextField
                  style={inputStyle}
                  label="Name"
                  id="name"
                  name="name"
                  value={GET_VALUE(referenceTerm.name)}
                  onChange={(e) => referenceTermChangeHandler(e)}
                />
              </DialogContent>
              <DialogActions
                style={{
                  display: "flex",
                  justifyContent: "start",
                  marginLeft: "17px",
                  marginBottom: "10px",
                }}
              >
                <Controls.SaveButton onClick={() => saveReferenceTerm()} />
                <Controls.CancelButton onClick={() => closeReferenceTerm()} />
              </DialogActions>
            </Dialog>
          </div>

          <TextField
            style={inputStyle}
            label="Version"
            type="text"
            id="version"
            name="version"
            onChange={(e) => conceptChangeHandler(e)}
            value={GET_VALUE(concept.version)}
          />
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

        {/* {conceptId !== "add" && !concept.retired && (
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
              value={GET_VALUE(concept.retireReason)}
              onChange={(e) => conceptChangeHandler(e)}
            />

            <div style={buttonGroupStyle}>
              <Controls.RetireButton
                retired={concept.retired}
                onClick={() => retireConcept()}
              />
            </div>
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
        )} */}
      </Paper>
    );
  }
}

export default withRouter(ConceptForm);
