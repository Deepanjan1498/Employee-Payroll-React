import config from "../config/config";
const axios = require('axios').default;

export default class EmployeeService {
  baseUrl = config.baseUrl;
  addEmployee(data) {
    console.log(this.baseUrl);
    return axios.post(`${this.baseUrl}employee`, data);
  }
}