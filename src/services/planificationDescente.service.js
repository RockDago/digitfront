// C:\Users\hp\Desktop\Digitalisation\frontend\src\services\planificationDescente.service.js
import axiosInstance from "../config/axios";

const API_PATH = "/planification-descente";

class PlanificationDescenteService {
  async getAllMissions() {
    const response = await axiosInstance.get(`${API_PATH}/`);
    return response.data;
  }

  async getMission(id) {
    const response = await axiosInstance.get(`${API_PATH}/${id}/`);
    return response.data;
  }

  async createMission(missionData) {
    const response = await axiosInstance.post(`${API_PATH}/`, missionData);
    return response.data;
  }

  async updateMission(id, missionData) {
    const response = await axiosInstance.put(`${API_PATH}/${id}/`, missionData);
    return response.data;
  }

  async deleteMission(id) {
    const response = await axiosInstance.delete(`${API_PATH}/${id}/`);
    return response.data;
  }
}

export default new PlanificationDescenteService();
