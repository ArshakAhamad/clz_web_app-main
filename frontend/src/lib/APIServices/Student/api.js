const API_BASE_URL = import.meta.env.VITE_SERVER_API;

// Generic function to handle authenticated API requests
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      // Attempt to parse error as JSON, fallback to text
      const contentType = response.headers.get('content-type');
      const errorData = contentType && contentType.includes('application/json')
        ? await response.json()
        : { message: await response.text() };

      console.error('API Error:', errorData.message || 'Unknown error');
      if (errorData.message === 'Student already enrolled in this class') {
        throw new Error('Student is already enrolled in this class');
      }
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('API Fetch Error:', err.message);
    throw err;
  }
}

// Create a new student
export async function createStudent(studentData) {
  const url = `${API_BASE_URL}/student/create-new`;
  console.log('Creating student with data:', studentData);
  return await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(studentData),
  });
}

// Fetch all students
export async function getAllStudents(searchTerm = '') {
  const url = `${API_BASE_URL}/student${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`;
  console.log('Fetching all students');
  return await fetchWithAuth(url);
}

// Fetch a student by QR code
export async function getStudentByQRCode(qrCode) {
  const url = `${API_BASE_URL}/student/qr/${qrCode}`;
  console.log(`Fetching student with QR Code: ${qrCode}`);
  return await fetchWithAuth(url);
}

// Fetch a student by ID
export async function getStudentById(studentId) {
  const url = `${API_BASE_URL}/student/${studentId}`;
  console.log(`Fetching student with ID: ${studentId}`);
  return await fetchWithAuth(url);
}

// Update student details
export async function updateStudent(studentData) {
  const url = `${API_BASE_URL}/student/update/${studentData.studentId}`;
  console.log('Updating student data:', studentData);
  return await fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(studentData),
  });
}

// Update student QR code
export async function updateStudentQRCode(studentId, qrCode) {
  const url = `${API_BASE_URL}/student/update/qr/${studentId}`;
  console.log(`Updating QR code for Student ID: ${studentId}`);
  return await fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify({ studentQRCode: qrCode }),
  });
}
