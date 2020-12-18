import config from "../config/config";
import AxiosService from "../services/axio-service"

export default class EmployeeService {
  baseUrl = config.baseUrl;
  addEmployee(data) {
    console.log(this.baseUrl);
    return AxiosService.postService(`${this.baseUrl}employee`, data);
  }
}