import config from "../config/config";
import  AxiosService  from "../services/axio-service.js"
export default class EmployeeService {
  baseUrl = config.baseUrl;
  addEmployee(data) {
    return AxiosService.postService(`${this.baseUrl}employee`, data);
  }
  updateEmployee(data) {
    return AxiosService.putService(`${this.baseUrl}employee/${data.id}`, data);
  }
  getAllEmployee() {
    return AxiosService.getService(`${this.baseUrl}employee`);
  }
  getEmployee(id) {
    return AxiosService.getService(`${this.baseUrl}employee/${id}`);
  }
  deleteEmployee(id) {
    return AxiosService.deleteService(`${this.baseUrl}employee/${id}`);
  }
}