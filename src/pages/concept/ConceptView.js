import React, { Fragment } from "react";
import {
  getConceptById,
  getConceptClasses,
  getConceptDataTypes,
  getConceptNameDetails,
} from "../../services/conceptService";

import { GET_VALUE } from "../../constants/otherConstants";
import LoadingData from "../../utils/LoadingData";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";

class ConceptView extends React.Component {
  constructor(props) {
    super(props);
    const initialConceptState = {
      conceptNames: [
        {
          name: "",
          conceptNameType: "FULLY_SPECIFIED",
        },
      ],
      classId: 1,
      isSet: false,
      conceptSets: [],
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
      conceptComplex: "",
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
      dataTypeOptions: [],
      dataType: 1,
      synonyms: initialConceptState.conceptNames.filter(
        (item) => item.conceptNameType !== ("FULLY_SPECIFIED" || "SHORT")
      ),
      redirect: null,
      isLoading: true,
    };

    this.redirectToEditPage = this.redirectToEditPage.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.setClassOptions(),
      this.setConceptOptions(),
      this.setDataTypeOptions(),
    ])
      .then(() => this.setFetchedConcept())
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

  setSynonyms() {
    return new Promise((resolve) => {
      const { conceptNames } = this.state.concept;
      const synonyms = conceptNames.filter(
        (item) => item.conceptNameType !== ("FULLY_SPECIFIED" || "SHORT")
      );
      this.setState({ synonyms }, () => resolve());
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

  redirectToEditPage(conceptId) {
    this.setState({ redirect: `/concept/edit/${conceptId}` });
  }

  render() {
    const {
      concept,
      synonyms,
      classOptions,
      conceptOptions,
      dataTypeOptions,
      dataType,
      conceptId,
      redirect,
      isLoading,
    } = this.state;
    const { redirectToEditPage } = this;
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

    const getDefaultConceptSetsValue = () => {
      const { conceptSets } = this.state.concept;

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

    const getDefaultDataTypeValue = dataTypeOptions.filter(
      (dataTypeOption) => dataTypeOption.value === dataType
    );

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <LoadingData />;

    console.log("concept", concept);
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

        <div>
          <span>Search Terms:</span>
          <span> </span>
        </div>

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
                {defaultConceptSetsValue.map((item) => (
                  <li key={item.uuid}>
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
            {getDefaultDataTypeValue.map((item, index) => (
              <span key={index}>{item.label}</span>
            ))}
          </span>
        </div>

        {dataType === 1 && concept.conceptNumeric !== null && (
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

        {dataType === 2 && (
          <div>
            <span>
              TO-DO Make concept answers custom object and loop to display and
              link
            </span>
            <span></span>
          </div>
        )}

        {dataType === 13 && (
          <div>
            <span>Handler</span>
            <span>{concept.conceptComplex}</span>
          </div>
        )}

        <div>
          <span>Mappings:</span>
          <span>TO-DO</span>
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
