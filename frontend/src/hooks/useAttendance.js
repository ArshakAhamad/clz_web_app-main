import { useState } from 'react'
import { markAttendance, getAttendance } from '@/lib/APIServices/Attendance/api'

export function useAttendance() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const markStudentAttendance = async (studentId, classId, qrCode) => {
    setLoading(true)
    setError(null)
    try {
      const result = await markAttendance(studentId, classId, qrCode)
      setLoading(false)
      return result
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  const fetchAttendance = async (filters) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getAttendance(filters)
      setLoading(false)
      return result
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  return { markStudentAttendance, fetchAttendance, loading, error }
}