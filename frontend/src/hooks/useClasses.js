// src/hooks/useClasses.js
import { useState, useEffect } from 'react'
import { fetchClasses } from '@/lib/APIServices/Class/api'

export function useClasses(searchTerm) {
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getClasses = async () => {
      setIsLoading(true)
      try {
        const response = await fetchClasses(searchTerm)
        setClasses(response.data)
        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    getClasses()
  }, [searchTerm])

  const refetch = () => {
    setIsLoading(true)
    fetchClasses(searchTerm)
      .then(response => {
        setClasses(response.data)
        setError(null)
      })
      .catch(err => setError(err))
      .finally(() => setIsLoading(false))
  }

  return { classes, isLoading, error, refetch }
}