import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_SERVER_API

export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments/create`, paymentData)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

export const getPaymentsByStudent = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/student`, { params: { studentId } })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}