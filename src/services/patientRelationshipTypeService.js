import axios from "axios";
import { PATIENT_RELATIONSHIP_TYPE } from "../constants/serviceConstants";

export const insertPatientRelationshipType = (data) =>
  axios.post(`${PATIENT_RELATIONSHIP_TYPE}`, data).then((res) => res);

export const getAllPatientRelationshipTypes = () =>
  axios.get(`${PATIENT_RELATIONSHIP_TYPE}`).then((res) => res);

export const getPatientRelationshipTypeById = (id) =>
  axios.get(`${PATIENT_RELATIONSHIP_TYPE}/${id}`).then((res) => res);

export const updatePatientRelationshipTypeById = (id, data) =>
  axios.put(`${PATIENT_RELATIONSHIP_TYPE}/${id}`, data).then((res) => res);

export const deletePatientRelationshipTypeById = (id) =>
  axios.delete(`${PATIENT_RELATIONSHIP_TYPE}/${id}`).then((res) => res);
