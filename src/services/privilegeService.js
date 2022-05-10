import axios from "axios";
import { PRIVILEGE } from "../constants/serviceConstants";

export const insertPrivilege = (data) =>
  axios.post(`${PRIVILEGE}`, data).then((res) => res);

export const getPrivileges = () => axios.get(`${PRIVILEGE}`).then((res) => res);

export const getPrivilegeById = (id) =>
  axios.get(`${PRIVILEGE}/${id}`).then((res) => res);

export const updatePrivilegeById = (id, data) =>
  axios.put(`${PRIVILEGE}/${id}`, data).then((res) => res);

export const deletePrivilegeById = (id) =>
  axios.delete(`${PRIVILEGE}/${id}`).then((res) => res);
