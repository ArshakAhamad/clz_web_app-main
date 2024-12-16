import { useState } from 'react'
import { createPayment, getPaymentsByStudent } from '@/lib/APIServices/Payment/api'

export function usePayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createNewPayment = async (paymentData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createPayment(paymentData)
      setLoading(false)
      return result
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  const fetchPaymentsByStudent = async (studentId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPaymentsByStudent(studentId)
      setLoading(false)
      return result
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  return { createNewPayment, fetchPaymentsByStudent, loading, error }
}