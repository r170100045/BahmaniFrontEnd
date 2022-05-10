import axios from "axios";
import { DRUG } from "../constants/serviceConstants";

export const insertDrug = (data) =>
  axios.post(`${DRUG}`, data).then((res) => res);

export const getAllDrugs = () => axios.get(`${DRUG}`).then((res) => res);

export const getDrugs = () =>
  axios.get(`${DRUG}`, { params: { compact: true } }).then((res) => res);

export const getDrugById = (id) =>
  axios.get(`${DRUG}/${id}`).then((res) => res);

export const updateDrugById = (id, data) =>
  axios.put(`${DRUG}/${id}`, data).then((res) => res);

export const deleteDrugById = (id) =>
  axios.delete(`${DRUG}/${id}`).then((res) => res);
