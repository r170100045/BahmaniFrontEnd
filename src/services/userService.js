import { PERSON_NAME, USER } from "../constants/serviceConstants";

import axios from "axios";

export const getUsers = () => axios.get(`${USER}`).then((res) => res);

export const getUserById = (id) =>
  axios.get(`${USER}/${id}`).then((res) => res);

export const getPersons = () => axios.get(`${PERSON_NAME}`).then((res) => res);
