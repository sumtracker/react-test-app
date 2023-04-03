import axios from "axios";
import config from "../config/config";
import { CONTACT } from "../constants/backend.constants";

type ListContactApi = {
  search?: string;
};

const listContacts = (args?: ListContactApi) => {
  let url = config.BACKEND_BASE + CONTACT.LIST
  
  // Limitting to 10 results for ease of use. Alternative is to fetch all and use a virtualized list
  let search = {limit: 10, ...args};

  return axios.get(url, {
    params: search,
  });
};
  
export { listContacts };
  