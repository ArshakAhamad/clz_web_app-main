import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_SERVER_API

export const markAttendance = async (studentId, classId, qrCode) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/attendance/mark-attendance`, {
      studentId,
      classId,
      studentQRCode: qrCode,
      attendanceDate: new Date().toISOString(),
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

export const getAttendance = async (filters) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/attendance`, { params: filters })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}