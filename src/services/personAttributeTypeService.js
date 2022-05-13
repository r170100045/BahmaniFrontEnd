import { PERSON_ATTRIBUTE_TYPE } from "../constants/serviceConstants";
import axios from "axios";

export const insertPersonAttributeType = (data) =>
  axios.post(`${PERSON_ATTRIBUTE_TYPE}`, data).then((res) => res);

export const getAllPersonAttributeTypes = () =>
  axios.get(`${PERSON_ATTRIBUTE_TYPE}`).then((res) => res);

export const getPersonAttributeTypeById = (id) =>
  axios.get(`${PERSON_ATTRIBUTE_TYPE}/${id}`).then((res) => res);

export const updatePersonAttributeTypeById = (id, data) =>
  axios.put(`${PERSON_ATTRIBUTE_TYPE}/${id}`, data).then((res) => res);

export const deletePersonAttributeTypeById = (id) =>
  axios.delete(`${PERSON_ATTRIBUTE_TYPE}/${id}`).then((res) => res);
