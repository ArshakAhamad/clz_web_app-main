import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_API;

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
}

export async function generateQRCodes(qrData) {
  const url = `${API_BASE_URL}/qr-codes/generate`; // Matches updated backend route
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(qrData),
  });
}

export async function fetchAllQRCodes() {
  const url = `${API_BASE_URL}/qr-codes`;
  return fetchWithAuth(url);
}

export async function fetchQRCodeDetails(qrCode) {
  const url = `${API_BASE_URL}/qr-codes/qrDetails/${qrCode}`;
  return fetchWithAuth(url);
}

export async function updateQRCodeStatus(qrCode, active) {
  const url = `${API_BASE_URL}/qr-codes/updateStatus/${qrCode}/${active}`;
  return fetchWithAuth(url, {
    method: 'PUT',
  });
}
