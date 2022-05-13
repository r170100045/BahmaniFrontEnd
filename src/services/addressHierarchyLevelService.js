import { ADDRESS_HIERARCHY_LEVEL } from "../constants/serviceConstants";
import axios from "axios";

export const getAllAddressHierarchyLevels = () =>
  axios.get(`${ADDRESS_HIERARCHY_LEVEL}`).then((res) => res);
