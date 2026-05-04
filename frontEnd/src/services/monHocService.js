import axios from 'axios'

const API_URL = 'http://localhost:5001/api'

export const getAllMonHoc = async () => {
  const response = await axios.get(`${API_URL}/monhoc`)
  return response.data.data
}