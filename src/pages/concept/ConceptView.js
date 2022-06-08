import React, { Fragment } from "react";
import { Redirect, Link as RouterLink, withRouter } from "react-router-dom";
import {
  getConceptById,
  getConceptClasses,
  getConceptDataTypes,
  getConceptMapTypes,
  getConceptNameDetails,
  getConceptReferenceSources,
} from "../../services/conceptService";

import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import { getDrugs } from "../../services/drugService";

class ConceptView extends React.Component {
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
          conceptMapTypeId: 1,
          conceptReferenceConceptSourceId: 1,
          conceptReferenceCode: "Confirmed",
          // conceptReferenceCode: null,
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
      classOptions: [
        {
          label: "",
          value: 1,
        },
      ],
      conceptOptions: [],
      drugOptions: [],
      dataTypeOptions: [],
      mapRelationshipOptions: [],
      mapSourceOptions: [],
      defaultMappings: [],
      synonyms: initialConceptState.conceptNames.filter(
        (item) => item.conceptNameType !== ("FULLY_SPECIFIED" || "SHORT")
      ),
      redirect: null,
      isLoading: true,
    };

    this.redirectToEditPage = this.redirectToEditPage.bind(this);
    this.redirectToAnotherConceptView =
      this.redirectToAnotherConceptView.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.setClassOptions(),
      this.setConceptOptions(),
      this.setDrugOptions(),
      this.setDataTypeOptions(),
      this.setMapRelationshipOptions(),
      this.setMapSourceOptions(),
    ])
      .then(() => this.setFetchedConcept())
      .then(() => this.setDefaultMappings())
      .then(() => this.setSynonyms())
      .then(() => this.setState({ isLoading: false }));
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
          this.setState({ conceptOptions }, () => {
            resolve();
          });
        })
        .catch((e) => reject(e));
    });
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

  setFetchedConcept() {
    const { conceptId } = this.state;

    return new Promise((resolve, reject) => {
      getConceptById(conceptId)
        .then((response) => {
          this.setState({ concept: response.data }, () => resolve());
        })
        .catch((e) => reject(e));
    });
  }

  setDefaultMappings() {
    return new Promise((resolve) => {
      const { concept, mapRelationshipOptions, mapSourceOptions } = this.state;

      const defaultMappings = [];
      concept.mappings.forEach((mapping) => {
        const sourceOption = mapSourceOptions.filter(
          (el) => el.value === mapping.conceptReferenceConceptSourceId
        );
        const source = sourceOption[0].label;

        const relationshipOption = mapRelationshipOptions.filter(
          (el) => el.value === mapping.conceptMapTypeId
        );
        const relationship = relationshipOption[0].label;

        defaultMappings.push({
          relationship: relationship,
          source: source,
          code: mapping.conceptReferenceCode,
          name: mapping.conceptReferenceName,
        });
      });

      this.setState({ defaultMappings }, () => resolve());
    });
  }

  setSynonyms() {
    return new Promise((resolve) => {
      const { conceptNames } = this.state.concept;
      const synonyms = conceptNames.filter(
        (item) => item.conceptNameType !== ("FULLY_SPECIFIED" || "SHORT")
      );
      this.setState({ synonyms }, () => resolve());
    });
  }

  redirectToEditPage(conceptId) {
    this.setState({ redirect: `/concept/edit/${conceptId}` });
  }

  redirectToAnotherConceptView(conceptId) {
    this.setState({ redirect: `/concept/view/${conceptId}` });
  }

  render() {
    const {
      concept,
      synonyms,
      classOptions,
      conceptOptions,
      drugOptions,
      dataTypeOptions,
      conceptId,
      defaultMappings,
      redirect,
      isLoading,
    } = this.state;
    const { redirectToEditPage, redirectToAnotherConceptView } = this;
    const { conceptNames, isSet } = concept;

    const getFullySpecifiedName = () => {
      const fullySpecifiedNameObject = conceptNames.find(
        (item) => item.conceptNameType === "FULLY_SPECIFIED"
      );
      return fullySpecifiedNameObject.name;
    };
    const fullySpecifiedName = getFullySpecifiedName();

    const getClassName = () => {
      const classNameObject = classOptions.find(
        (item) => item.value === concept.classId
      );
      return classNameObject.label;
    };
    const className = getClassName();

    const getDefaultConceptSets = () => {
      const { conceptSets } = this.state.concept;

      let defaultConceptSets = [];
      conceptSets.forEach((conceptIdValue) => {
        const eachValueOptions = conceptOptions.filter(
          (conceptOption) => conceptOption.value === conceptIdValue
        );
        defaultConceptSets = [...defaultConceptSets, ...eachValueOptions];
      });
      return defaultConceptSets;
    };
    const defaultConceptSets = getDefaultConceptSets();

    const getDefaultConceptAnswersConcepts = () => {
      const { conceptAnswersConcepts } = this.state.concept;

      let defaultConceptAnswersConcepts = [];
      conceptAnswersConcepts.forEach((conceptIdValue) => {
        const eachValueOptions = conceptOptions.filter(
          (conceptOption) => conceptOption.value === conceptIdValue
        );
        defaultConceptAnswersConcepts = [
          ...defaultConceptAnswersConcepts,
          ...eachValueOptions,
        ];
      });
      return defaultConceptAnswersConcepts;
    };
    const defaultConceptAnswersConcepts = getDefaultConceptAnswersConcepts();

    const getDefaultConceptAnswersDrugs = () => {
      const { conceptAnswersDrugs } = this.state.concept;

      let defaultConceptAnswersDrugs = [];
      conceptAnswersDrugs.forEach((drugIdValue) => {
        const eachValueOptions = drugOptions.filter(
          (drugOption) => drugOption.value === drugIdValue
        );
        defaultConceptAnswersDrugs = [
          ...defaultConceptAnswersDrugs,
          ...eachValueOptions,
        ];
      });
      return defaultConceptAnswersDrugs;
    };
    const defaultConceptAnswersDrugs = getDefaultConceptAnswersDrugs();

    const getDefaultDataType = dataTypeOptions.filter(
      (dataTypeOption) => dataTypeOption.value === concept.dataTypeId
    );

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <LoadingData />;

    return (
      <Fragment>
        <button type="button" onClick={() => redirectToEditPage(conceptId)}>
          Edit
        </button>
        <div>
          <span>ID:</span>
          <span>{concept.conceptId}</span>
        </div>

        <div>
          <span>UUID:</span>
          <span>{concept.uuid}</span>
        </div>

        <div>
          <span>Fuly Specified Name:</span>
          <span>{GET_VALUE(fullySpecifiedName)}</span>
        </div>

        <div>
          <span>Synonyms:</span>
          <span>
            <ul>
              {synonyms.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </span>
        </div>

        {/* <div>
          <span>Search Terms:</span>
          <span> </span>
        </div> */}

        <div>
          <span>Short Name:</span>
          <span>{GET_VALUE(concept.shortName)} </span>
        </div>

        <div>
          <span>Description:</span>
          <span>{GET_VALUE(concept.description)} </span>
        </div>

        <div>
          <span>Class:</span>
          <span>{GET_VALUE(className)} </span>
        </div>

        {isSet && (
          <div>
            <span>Set Members:</span>
            <span>
              <ul>
                {defaultConceptSets.map((item) => (
                  <li key={item.uuid}>
                    {/* <button
                      onClick={() => redirectToAnotherConceptView(item.uuid)}
                    >
                      {item.label}
                    </button> */}
                    <RouterLink to={`/concept/view/${item.uuid}`}>
                      {item.label}
                    </RouterLink>
                    <a href={`/concept/view/${item.uuid}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </span>
          </div>
        )}

        <div>
          <span>Data Type:</span>
          <span>
            {getDefaultDataType.map((item, index) => (
              <span key={index}>{item.label}</span>
            ))}
          </span>
        </div>

        {concept.dataTypeId === 1 && concept.conceptNumeric !== null && (
          <div>
            <span>Numeric</span>
            <span>
              <div>
                <span>Absolute High</span>
                <span>{GET_VALUE(concept.conceptNumeric.hiAbsolute)}</span>
              </div>
              <div>
                <span>Crirical High</span>
                <span>{GET_VALUE(concept.conceptNumeric.hiCritical)}</span>
              </div>
              <div>
                <span>Normal High</span>
                <span>{GET_VALUE(concept.conceptNumeric.hiNormal)}</span>
              </div>
              <div>
                <span>Normal Low</span>
                <span>{GET_VALUE(concept.conceptNumeric.lowNormal)}</span>
              </div>
              <div>
                <span>Critical Low</span>
                <span>{GET_VALUE(concept.conceptNumeric.lowCritical)}</span>
              </div>
              <div>
                <span>Absolute Low</span>
                <span>{GET_VALUE(concept.conceptNumeric.lowAbsolute)}</span>
              </div>
              <div>
                <span>Units</span>
                <span>{GET_VALUE(concept.conceptNumeric.units)}</span>
              </div>
              <div>
                <span>Allow Decimal?</span>
                <span>
                  {concept.conceptNumeric.precise === true ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span>Display Precision</span>
                <span>
                  {GET_VALUE(concept.conceptNumeric.displayPrecision)}
                </span>
              </div>
            </span>
          </div>
        )}

        {concept.dataTypeId === 2 && (
          <div>
            <div>
              <span>Answer Concepts</span>
              <ul>
                {defaultConceptAnswersConcepts.map((item) => (
                  <li key={item.uuid}>
                    <RouterLink to={`/concept/view/${item.uuid}`}>
                      {item.label}
                    </RouterLink>
                    <a href={`/concept/view/${item.uuid}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span>Answer Drugs</span>
              <ul>
                {defaultConceptAnswersDrugs.map((item) => (
                  <li key={item.conceptUuid}>
                    <RouterLink to={`/concept/view/${item.conceptUuid}`}>
                      {item.label}
                    </RouterLink>
                    <a href={`/concept/view/${item.conceptUuid}`}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {concept.dataTypeId === 13 && (
          <div>
            <span>Handler</span>
            <span>{GET_VALUE(concept.conceptComplex)}</span>
          </div>
        )}

        <div>
          <span>Mappings:</span>
          {concept.mappings.length > 0 && (
            <div>
              <div>
                <span>Relationship</span>
                <span>Source</span>
                <span>Code</span>
                <span>Name</span>
              </div>
              {defaultMappings.map((mapping, index) => (
                <div key={mapping + index}>
                  <span>{GET_VALUE(mapping.relationship)}</span>
                  <span>{GET_VALUE(mapping.source)}</span>
                  <span>{GET_VALUE(mapping.code)}</span>
                  <span>{GET_VALUE(mapping.name)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <span>Version:</span>
          <span>{concept.version}</span>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(ConceptView);
