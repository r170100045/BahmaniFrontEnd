import axios from "axios";
import { CONCEPT_NAME, CONCEPT_CLASS,CONCEPT_DATA_TYPE } from "../constants/serviceConstants";

export const getConceptNames = () =>
  axios.get(`${CONCEPT_NAME}`).then((res) => res);

export const getConceptNameDetails = () =>
  axios.get(`${CONCEPT_NAME}/details`).then((res) => res);

export const getConceptClasses = () =>
  axios.get(`${CONCEPT_CLASS}`).then((res) => res);

  export const getConceptDataTypes = () =>
  axios.get(`${CONCEPT_DATA_TYPE}`).then((res) => res);