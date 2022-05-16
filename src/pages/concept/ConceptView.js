import React, { Fragment } from "react";
import {
  getConceptById,
  getConceptClasses,
  getConceptDataTypes,
  getConceptNameDetails,
} from "../../services/conceptService";

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
      conceptSets: [{ conceptId: 4 }, { conceptId: 5 }],
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
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setClassOptions()
      .then(() => this.setConceptOptions())
      .then(() => this.setDataTypeOptions())
      .then(() => this.setFetchedConcept())
      .then(() => this.setDataType())
      .then(() => this.setSynonyms())
      .then(() => this.setState({ isLoading: false }));
  }

  setDataType() {
    const { concept } = this.state;

    return new Promise((resolve) => {
      this.setState({ dataType: concept.dataTypeId.conceptDataTypeId }, () =>
        resolve("success")
      );
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
            resolve("success");
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
            resolve("success");
          });
        })
        .catch((e) => reject(e));
    });
  }

  setSynonyms() {
    const { conceptNames } = this.state.concept;
    return new Promise((resolve) => {
      const synonyms = conceptNames.filter(
        (item) => item.conceptNameType !== ("FULLY_SPECIFIED" || "SHORT")
      );
      this.setState({ synonyms }, () => resolve("success"));
    });
  }

  setFetchedConcept() {
    const { conceptId } = this.state;

    return new Promise((resolve, reject) => {
      getConceptById(conceptId)
        .then((response) => {
          this.setState({ concept: response.data });
        })
        .then(() => resolve("success"))
        .catch((e) => reject(e));
    });
  }

  getValueFor(field) {
    return field === null ? "" : field;
  }

  render() {
    const {
      isLoading,
      concept,
      synonyms,
      classOptions,
      conceptOptions,
      dataTypeOptions,
      dataType,
      conceptId,
    } = this.state;
    const { getValueFor } = this;
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

    if (!isLoading) {
      console.log("concept", concept);
      return (
        <Fragment>
          <button type="button">
            <a href={`/concept/edit/${conceptId}`}>Edit</a>
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
            <span>{getValueFor(fullySpecifiedName)}</span>
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
            <span>{getValueFor(concept.shortName)} </span>
          </div>

          <div>
            <span>Description:</span>
            <span>{getValueFor(concept.description)} </span>
          </div>

          <div>
            <span>Class:</span>
            <span>{getValueFor(className)} </span>
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

          {dataType === 1 && (
            <div>
              <span>Numeric</span>
              <span>
                <div>
                  <span>Absolute High</span>
                  <span>{concept.conceptNumeric.hiAbsolute}</span>
                </div>
                <div>
                  <span>Crirical High</span>
                  <span>{concept.conceptNumeric.hiCritical}</span>
                </div>
                <div>
                  <span>Normal High</span>
                  <span>{concept.conceptNumeric.hiNormal}</span>
                </div>
                <div>
                  <span>Normal Low</span>
                  <span>{concept.conceptNumeric.lowNormal}</span>
                </div>
                <div>
                  <span>Critical Low</span>
                  <span>{concept.conceptNumeric.lowCritical}</span>
                </div>
                <div>
                  <span>Absolute Low</span>
                  <span>{concept.conceptNumeric.lowAbsolute}</span>
                </div>
                <div>
                  <span>Units</span>
                  <span>{concept.conceptNumeric.units}</span>
                </div>
                <div>
                  <span>Allow Decimal?</span>
                  <span>
                    {concept.conceptNumeric.precise === true ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span>Display Precision</span>
                  <span>{concept.conceptNumeric.displayPrecision}</span>
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

    return <p>Loading...</p>;
  }
}

export default withRouter(ConceptView);
