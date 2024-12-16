// Fetching the Base URL from the .env file
const API_BASE_URL = import.meta.env.VITE_SERVER_API

// Fetching the token from the localStorage and adding it to the headers
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'API request failed')
  }
  return response.json()
}

// Fetching the classes from the API
export async function fetchClasses(searchTerm) {
  const url = `${API_BASE_URL}/class?search=${searchTerm}`
  return fetchWithAuth(url)
}

// Create a new class
export async function createClass(classData) {
  const url = `${API_BASE_URL}/class/create`
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(classData),
  })
}

// Updating the class data
export async function updateClass(classData) {
  const url = `${API_BASE_URL}/class/update/${classData.classId}`
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(classData),
  })
}

export async function fetchUsers() {
  try {
    const url = `${API_BASE_URL}/user`
    const response = await fetchWithAuth(url)
    return response.data || [] // Return the data array or an empty array
  } catch (error) {
    console.error('Error fetching users:', error)
    return [] // Return an empty array in case of error
  }
}

export async function fetchRoles() {
  try {
    const url = `${API_BASE_URL}/user/roles`
    const response = await fetchWithAuth(url)
    return response.data || [] // Return the data array or an empty array
  } catch (error) {
    console.error('Error fetching roles:', error)
    return [] // Return an empty array in case of error
  }
}