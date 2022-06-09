import { PERSON, USER } from "../constants/serviceConstants";

import axios from "axios";

export const getUsers = () =>
  axios.get(`${USER}/`, { params: { compact: "true" } }).then((res) => res);

export const getUserById = (id) =>
  axios.get(`${USER}/${id}`).then((res) => res);

export const insertUser = (data) =>
  axios.post(`${USER}`, data).then((res) => res);

export const updateUserById = (id, data) =>
  axios.put(`${USER}/${id}`, data).then((res) => res);

export const getPersons = () => axios.get(`${PERSON}`).then((res) => res);

export const getPersonById = (id) =>
  axios
    .get(`${PERSON}/${id}`, { params: { compact: "true" } })
    .then((res) => res);

export const insertPerson = (data) =>
  axios.post(`${PERSON}`, data).then((res) => res);

export const updatePersonById = (id, data) =>
  axios.put(`${PERSON}/${id}`, data).then((res) => res);
