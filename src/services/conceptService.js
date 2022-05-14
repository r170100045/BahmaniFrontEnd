import {
  CONCEPT,
  CONCEPT_CLASS,
  CONCEPT_DATA_TYPE,
  CONCEPT_MAP_TYPE,
  CONCEPT_NAME,
  CONCEPT_REFERENCE_SOURCE,
  CONCEPT_REFERENCE_TERM,
} from "../constants/serviceConstants";

import axios from "axios";

export const getConceptById = (id) =>
  axios.get(`${CONCEPT}/${id}`).then((res) => res);

export const insertConcept = (body) =>
  axios.post(`${CONCEPT}`, body).then((res) => res);

export const updateConceptById = (id, body) =>
  axios.put(`${CONCEPT}/${id}`, body).then((res) => res);

export const deleteConceptById = (id) =>
  axios.delete(`${CONCEPT}/${id}`).then((res) => res);

export const getConceptNames = () =>
  axios.get(`${CONCEPT_NAME}`).then((res) => res);

export const getConceptNameDetails = () =>
  axios.get(`${CONCEPT_NAME}/details`).then((res) => res);

export const getConceptClasses = () =>
  axios.get(`${CONCEPT_CLASS}`).then((res) => res);

export const getConceptDataTypes = () =>
  axios.get(`${CONCEPT_DATA_TYPE}`).then((res) => res);

export const getConceptMapTypes = () =>
  axios
    .get(`${CONCEPT_MAP_TYPE}`, { params: { hidden: false } })
    .then((res) => res);

export const getConceptReferenceSources = () =>
  axios
    .get(`${CONCEPT_REFERENCE_SOURCE}`, { params: { hidden: false } })
    .then((res) => res);

export const getConceptReferenceTerms = () =>
  axios.get(`${CONCEPT_REFERENCE_TERM}`).then((res) => res);
