import axios from "axios";
import { ADDRESS_HIERARCHY_LEVEL } from "../constants/serviceConstants";

export const getAllAddressHierarchyLevels = () =>
  axios.get(`${ADDRESS_HIERARCHY_LEVEL}`).then((res) => res);
