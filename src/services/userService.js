import { PERSON, PERSON_NAME, USER } from "../constants/serviceConstants";

import axios from "axios";

export const getUsers = () =>
  axios.get(`${USER}`, { params: { compact: "true" } }).then((res) => res);

export const getUserById = (id) =>
  axios.get(`${USER}/${id}`).then((res) => res);

export const getPersons = () => axios.get(`${PERSON}`).then((res) => res);
export const getPersonById = (id) =>
  axios
    .get(`${PERSON}/${id}`, { params: { compact: "true" } })
    .then((res) => res);
