import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { Fragment } from "react";
import { Redirect, Link as RouterLink, withRouter } from "react-router-dom";
import {
  buttonGroupStyle,
  conceptViewInfo,
  inputInfoStyle,
  paperStyle,
  propertyName,
  propertyNameBolder,
} from "../../constants/formStyling";
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
      conceptAnswerDrugs: [20, 2],
      conceptAnswerConcepts: [55, 40],
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
    this.fetchData();
  }

  fetchData() {
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

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState(
        { conceptId: this.props.match.params.id, isLoading: true },
        () => {
          this.fetchData();
        }
      );
    }
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

    const getDefaultConceptAnswerConcepts = () => {
      const { conceptAnswerConcepts } = this.state.concept;

      let defaultConceptAnswerConcepts = [];
      conceptAnswerConcepts.forEach((conceptIdValue) => {
        const eachValueOptions = conceptOptions.filter(
          (conceptOption) => conceptOption.value === conceptIdValue
        );
        defaultConceptAnswerConcepts = [
          ...defaultConceptAnswerConcepts,
          ...eachValueOptions,
        ];
      });
      return defaultConceptAnswerConcepts;
    };
    const defaultConceptAnswerConcepts = getDefaultConceptAnswerConcepts();

    const getDefaultConceptAnswerDrugs = () => {
      const { conceptAnswerDrugs } = this.state.concept;

      let defaultConceptAnswerDrugs = [];
      conceptAnswerDrugs.forEach((drugIdValue) => {
        const eachValueOptions = drugOptions.filter(
          (drugOption) => drugOption.value === drugIdValue
        );
        defaultConceptAnswerDrugs = [
          ...defaultConceptAnswerDrugs,
          ...eachValueOptions,
        ];
      });
      return defaultConceptAnswerDrugs;
    };
    const defaultConceptAnswerDrugs = getDefaultConceptAnswerDrugs();

    const getDefaultDataType = dataTypeOptions.filter(
      (dataTypeOption) => dataTypeOption.value === concept.dataTypeId
    );

    if (redirect) return <Redirect to={redirect} />;

    if (isLoading) return <LoadingData />;

    console.debug(concept);
    return (
      <Fragment>
        <Paper style={paperStyle}>
          {/* <div style={{ display: "flex", justifyContent: "end" }}>
            <div style={buttonGroupStyle}>
              <Button
                style={{ backgroundColor: "#a7b3ee" }}
                variant="outlined"
                type="button"
                size="small"
                onClick={() => redirectToEditPage(conceptId)}
              >
                Edit
              </Button>
            </div>
          </div> */}

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>ID:</span>
            <span style={conceptViewInfo}>{concept.conceptId}</span>
          </div>

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>UUID:</span>
            <span style={conceptViewInfo}>{concept.uuid}</span>
          </div>

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>Fully Specified Name:</span>
            <span style={conceptViewInfo}>{GET_VALUE(fullySpecifiedName)}</span>
          </div>

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>Synonyms:</span>
            <span>
              {synonyms.map((item, index) =>
                index === synonyms.length - 1 ? (
                  <span key={index} style={{ marginLeft: 5 }}>
                    {item.name}
                  </span>
                ) : (
                  <span key={index} style={{ marginLeft: 5 }}>
                    {item.name},
                  </span>
                )
              )}
            </span>
          </div>

          {/* <div>
          <span>Search Terms:</span>
          <span> </span>
        </div> */}

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>Short Name:</span>
            <span style={conceptViewInfo}>{GET_VALUE(concept.shortName)} </span>
          </div>

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>Description:</span>
            <span style={conceptViewInfo}>
              {GET_VALUE(concept.description)}{" "}
            </span>
          </div>

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>Class:</span>
            <span style={conceptViewInfo}>{GET_VALUE(className)} </span>
          </div>

          {isSet && (
            <div style={{ marginTop: "5px" }}>
              <span style={propertyNameBolder}>Set Members:</span>

              <span>
                {defaultConceptSets.map((item, index) =>
                  index === defaultConceptSets.length - 1 ? (
                    <RouterLink
                      to={`/concept/view/${item.uuid}`}
                      style={{ textDecoration: "none", marginLeft: 5 }}
                    >
                      {item.label}
                    </RouterLink>
                  ) : (
                    <RouterLink
                      to={`/concept/view/${item.uuid}`}
                      style={{ textDecoration: "none", marginLeft: 5 }}
                    >
                      {item.label} |
                    </RouterLink>
                  )
                )}
              </span>
            </div>
          )}

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>Data Type:</span>
            <span>
              {getDefaultDataType.map((item, index) => (
                <span style={conceptViewInfo} key={index}>
                  {item.label}
                </span>
              ))}
            </span>
          </div>

          {concept.dataTypeId === 1 && concept.conceptNumeric !== null && (
            <div style={conceptViewInfo}>
              <span style={propertyNameBolder}>Numeric Details:</span>
              <div style={{ marginLeft: 20 }}>
                <div>
                  <span style={propertyNameBolder}>Absolute High:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.hiAbsolute)}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Crirical High:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.hiCritical)}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Normal High:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.hiNormal)}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Normal Low:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.lowNormal)}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Critical Low:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.lowCritical)}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Absolute Low:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.lowAbsolute)}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Units:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.units)}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Allow Decimal?</span>
                  <span style={conceptViewInfo}>
                    {concept.conceptNumeric.precise === true ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span style={propertyNameBolder}>Display Precision:</span>
                  <span style={conceptViewInfo}>
                    {GET_VALUE(concept.conceptNumeric.displayPrecision)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {concept.dataTypeId === 2 && (
            <div style={{ marginLeft: 20 }}>
              {defaultConceptAnswerConcepts.length > 0 && (
                <div>
                  <span style={propertyNameBolder}>
                    Coded: Answer Concepts:
                  </span>
                  {defaultConceptAnswerConcepts.map((item, index) =>
                    index === defaultConceptAnswerConcepts.length - 1 ? (
                      <span key={item.uuid} style={{ marginLeft: 5 }}>
                        <RouterLink
                          to={`/concept/view/${item.uuid}`}
                          style={{ textDecoration: "none" }}
                        >
                          {item.label}
                        </RouterLink>
                      </span>
                    ) : (
                      <span key={item.uuid} style={{ marginLeft: 5 }}>
                        <RouterLink
                          to={`/concept/view/${item.uuid}`}
                          style={{ textDecoration: "none" }}
                        >
                          {item.label} |
                        </RouterLink>
                      </span>
                    )
                  )}
                </div>
              )}

              {defaultConceptAnswerDrugs.length > 0 && (
                <div>
                  <span style={propertyNameBolder}>Coded: Answer Drugs:</span>
                  {defaultConceptAnswerDrugs.map((item, index) =>
                    index === defaultConceptAnswerDrugs.length - 1 ? (
                      <span key={item.uuid} style={{ marginLeft: 5 }}>
                        <RouterLink
                          to={`/concept/view/${item.conceptUuid}`}
                          style={{ textDecoration: "none" }}
                        >
                          {item.label}
                        </RouterLink>
                      </span>
                    ) : (
                      <span key={item.uuid} style={{ marginLeft: 5 }}>
                        <RouterLink
                          to={`/concept/view/${item.conceptUuid}`}
                          style={{ textDecoration: "none" }}
                        >
                          {item.label} |
                        </RouterLink>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {concept.dataTypeId === 13 && (
            <div style={{ marginLeft: 20 }}>
              <span style={propertyNameBolder}>Complex Handler:</span>
              <span style={conceptViewInfo}>
                {GET_VALUE(concept.conceptComplex)}
              </span>
            </div>
          )}

          <div style={{ marginTop: 5 }}>
            <span style={propertyNameBolder}>Mappings:</span>
            <div style={{ marginLeft: 20 }}>
              {concept.mappings.length > 0 && (
                <TableContainer
                  container
                  direction="column"
                  alignItems="center"
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        container
                        direction="row"
                        justifyContent="space-between"
                      >
                        <TableCell>Relationship</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Name</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {defaultMappings.map((mapping, index) => (
                        <TableRow
                          container
                          direction="row"
                          justifyContent="space-between"
                          key={mapping + index}
                        >
                          <TableCell>
                            {GET_VALUE(mapping.relationship)}
                          </TableCell>
                          <TableCell>{GET_VALUE(mapping.source)}</TableCell>
                          <TableCell>{GET_VALUE(mapping.code)}</TableCell>
                          <TableCell>{GET_VALUE(mapping.name)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </div>

          <div style={{ marginTop: "5px" }}>
            <span style={propertyNameBolder}>Version:</span>
            <span style={conceptViewInfo}>{concept.version}</span>
          </div>
        </Paper>
      </Fragment>
    );
  }
}

export default withRouter(ConceptView);
