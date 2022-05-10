import { USER } from '../constants/serviceConstants';
import axios from 'axios';

export const getUsers = () => axios.get(`${USER}`).then((res) => res);
