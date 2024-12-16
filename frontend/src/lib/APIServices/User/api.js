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

// Fetch the logged-in user's data by verifying the token and returning the user data
export async function fetchUserData() {
  const url = `${API_BASE_URL}/auth/verify-token`
  const response = await fetchWithAuth(url)
  const userData = response.payload
  const url2 = `${API_BASE_URL}/user/${userData.userId}`
  return fetchWithAuth(url2)
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

export async function createUser(userData) {
  const url = `${API_BASE_URL}/user/create-new`
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function updateUser(userData) {
  const url = `${API_BASE_URL}/user/update/${userData.userId}`
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(userData),
  })
}