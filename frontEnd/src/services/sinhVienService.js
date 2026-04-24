import axios from 'axios'

const API_URL = 'http://localhost:5001/api'

export const getAllSinhVien = async () => {
  const response = await axios.get(`${API_URL}/sinhvien`)
  return response.data.data
}