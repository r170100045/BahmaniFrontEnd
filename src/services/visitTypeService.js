import { VISIT_TYPE } from "../constants/serviceConstants";
import axios from "axios";

export const insertVisitType = (data) =>
  axios.post(`${VISIT_TYPE}`, data).then((res) => res);

export const getAllVisitTypes = () =>
  axios.get(`${VISIT_TYPE}`).then((res) => res);

export const getVisitTypeById = (id) =>
  axios.get(`${VISIT_TYPE}/${id}`).then((res) => res);

export const updateVisitTypeById = (id, data) =>
  axios.put(`${VISIT_TYPE}/${id}`, data).then((res) => res);

export const deleteVisitTypeById = (id) =>
  axios.delete(`${VISIT_TYPE}/${id}`).then((res) => res);
