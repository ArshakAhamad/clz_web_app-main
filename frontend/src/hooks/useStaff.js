// src/hooks/useStaff.js
import { useState, useEffect } from 'react'
import { fetchUsers } from '@/lib/APIServices/User/api'

export function useStaff(searchTerm) {
  const [staff, setStaff] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getStaff = async () => {
      setIsLoading(true)
      try {
        const response = await fetchUsers(searchTerm)
        setStaff(response)
        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    getStaff()
  }, [searchTerm])

  const refetch = () => {
    setIsLoading(true)
    fetchUsers(searchTerm)
      .then(response => {
        setStaff(response)
        setError(null)
      })
      .catch(err => setError(err))
      .finally(() => setIsLoading(false))
  }

  return { staff, isLoading, error, refetch }
}