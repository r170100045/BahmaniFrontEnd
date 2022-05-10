import axios from "axios";
import { USER } from "../constants/serviceConstants";

export const getUsers = () => axios.get(`${USER}`).then((res) => res);
