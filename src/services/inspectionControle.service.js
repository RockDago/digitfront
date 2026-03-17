// C:\Users\hp\Desktop\Digitalisation\frontend\src\services\inspectionControle.service.js
import axiosInstance from "../config/axios";

const API_PATH = "/inspection-controle";

class InspectionControleService {
  async getAllInspections() {
    const response = await axiosInstance.get(API_PATH);
    return response.data;
  }

  async getInspection(id) {
    const response = await axiosInstance.get(`${API_PATH}/${id}`);
    return response.data;
  }

  async createInspection(data) {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post(API_PATH, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
    });
    return response.data;
  }

  async updateInspection(id, data) {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.put(`${API_PATH}/${id}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
    });
    return response.data;
  }

  async deleteInspection(id) {
    const response = await axiosInstance.delete(`${API_PATH}/${id}`);
    return response.data;
  }
}

export default new InspectionControleService();
