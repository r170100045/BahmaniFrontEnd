import { ROLE } from "../constants/serviceConstants";
import axios from "axios";

export const insertRole = (data) =>
  axios.post(`${ROLE}`, data).then((res) => res);

export const getRoleByName = (name) =>
  axios.get(`${ROLE}`, { params: { name: name } }).then((res) => res);

export const getRoles = () => axios.get(`${ROLE}`).then((res) => res);

export const getRoleById = (id) =>
  axios.get(`${ROLE}/${id}`).then((res) => res);

export const updateRoleById = (id, data) =>
  axios.put(`${ROLE}/${id}`, data).then((res) => res);

export const deleteRoleById = (id) =>
  axios.delete(`${ROLE}/${id}`).then((res) => res);
