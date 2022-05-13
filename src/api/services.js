import {
  ADDRESS_HIERARCHY_LEVEL,
  CONCEPT,
  CONCEPT_CLASS,
  CONCEPT_DATA_TYPE,
  CONCEPT_MAP_TYPE,
  CONCEPT_NAME,
  CONCEPT_REFERENCE_SOURCE,
  CONCEPT_REFERENCE_TERM,
  DRUG,
  PATIENT_RELATIONSHIP_TYPE,
  PERSON_ATTRIBUTE_TYPE,
  PERSON_NAME,
  PRIVILEGE,
  ROLE,
  USER,
  VISIT_TYPE,
} from "../constants/serviceConstants";

import axios from "axios";

// address hierarchy
export const getAddressHierarchies = () =>
  axios.get(`${ADDRESS_HIERARCHY_LEVEL}`).then((res) => res);

// concept map types
export const getConceptMapTypes = () =>
  axios
    .get(`${CONCEPT_MAP_TYPE}`, { params: { hidden: false } })
    .then((res) => res);

// concept reference source
export const getConceptReferenceSources = () =>
  axios
    .get(`${CONCEPT_REFERENCE_SOURCE}`, { params: { hidden: false } })
    .then((res) => res);

// concept reference term
export const getConceptReferenceTerms = () =>
  axios.get(`${CONCEPT_REFERENCE_TERM}`).then((res) => res);

// user apis
export const getUsers = () => axios.get(`${USER}`).then((res) => res);
export const getUser = (id) => axios.get(`${USER}/${id}`).then((res) => res);

// list of all concept names
export const getConceptNames = () =>
  axios.get(`${CONCEPT_NAME}`).then((res) => res);
export const getConceptUuid = (id) =>
  axios.get(`${CONCEPT_NAME}/${id}`).then((res) => res);
export const getConceptNameDetails = () =>
  axios.get(`${CONCEPT_NAME}/details`).then((res) => res);

// concept apis
export const getConcepts = () => axios.get(`${CONCEPT}`).then((res) => res);
export const getConceptById = (id) =>
  axios.get(`${CONCEPT}/${id}`).then((res) => res);
export const postConcept = (body) =>
  axios.post(`${CONCEPT}`, body).then((res) => res);
export const putConceptById = (id, body) =>
  axios.put(`${CONCEPT}/${id}`, body).then((res) => res);
export const deleteConceptById = (id) =>
  axios.delete(`${CONCEPT}/${id}`).then((res) => res);

// conceptClass apis
export const getConceptClasses = () =>
  axios.get(`${CONCEPT_CLASS}`).then((res) => res);
export const getConceptClassById = (id) =>
  axios.get(`${CONCEPT_CLASS}/${id}`).then((res) => res);
export const postConceptClass = (body) =>
  axios.post(`${CONCEPT_CLASS}`, body).then((res) => res);
export const putConceptClassById = (id, body) =>
  axios.put(`${CONCEPT_CLASS}/${id}`, body).then((res) => res);
export const deleteConceptClassById = (id) =>
  axios.delete(`${CONCEPT_CLASS}/${id}`).then((res) => res);

// conceptDataType apis
export const getConceptDataTypes = () =>
  axios.get(`${CONCEPT_DATA_TYPE}`).then((res) => res);

// drug apis
export const getDrugs = () =>
  axios.get(`${DRUG}`, { params: { compact: true } }).then((res) => res);
export const getDrugById = (id) =>
  axios.get(`${DRUG}/${id}`).then((res) => res);
export const postDrug = (body) =>
  axios.post(`${DRUG}`, body).then((res) => res);
export const putDrugById = (id, body) =>
  axios.put(`${DRUG}/${id}`, body).then((res) => res);
export const deleteDrugById = (id) =>
  axios.delete(`${DRUG}/${id}`).then((res) => res);

// person name api
export const getPersons = () => axios.get(`${PERSON_NAME}`).then((res) => res);

// personAttributeType apis
export const getPersonAttributeTypes = () =>
  axios.get(`${PERSON_ATTRIBUTE_TYPE}`).then((res) => res);
export const getPersonAttributeTypeById = (id) =>
  axios.get(`${PERSON_ATTRIBUTE_TYPE}/${id}`).then((res) => res);
export const createPersonAttributeType = (body) =>
  axios.post(`${PERSON_ATTRIBUTE_TYPE}`, body).then((res) => res);
export const updatePersonAttributeTypeById = (id, body) =>
  axios.put(`${PERSON_ATTRIBUTE_TYPE}/${id}`, body).then((res) => res);
export const deletePersonAttributeTypeById = (id) =>
  axios.delete(`${PERSON_ATTRIBUTE_TYPE}/${id}`).then((res) => res);

// relationshipType apis
export const getRelationshipTypes = () =>
  axios.get(`${PATIENT_RELATIONSHIP_TYPE}`).then((res) => res);
export const getRelationshipTypeById = (id) =>
  axios.get(`${PATIENT_RELATIONSHIP_TYPE}/${id}`).then((res) => res);
export const createRelationshipType = (body) =>
  axios.post(`${PATIENT_RELATIONSHIP_TYPE}`, body).then((res) => res);
export const updateRelationshipTypeById = (id, body) =>
  axios.put(`${PATIENT_RELATIONSHIP_TYPE}/${id}`, body).then((res) => res);
export const deleteRelationshipTypeById = (id) =>
  axios.delete(`${PATIENT_RELATIONSHIP_TYPE}/${id}`).then((res) => res);

// visitType apis
export const getVisitTypes = () =>
  axios.get(`${VISIT_TYPE}`).then((res) => res);
export const getVisitTypeById = (id) =>
  axios.get(`${VISIT_TYPE}/${id}`).then((res) => res);
export const createVisitType = (body) =>
  axios.post(`${VISIT_TYPE}`, body).then((res) => res);
export const updateVisitTypeById = (id, body) =>
  axios.put(`${VISIT_TYPE}/${id}`, body).then((res) => res);
export const deleteVisitTypeById = (id) =>
  axios.delete(`${VISIT_TYPE}/${id}`).then((res) => res);

// role apis
export const getRoles = () => axios.get(`${ROLE}`).then((res) => res);
