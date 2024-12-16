import { useState, useEffect } from 'react';
import {
  getAllQRCodes,
  generateQRCodes,
  getQRCodeById,
  updateQRCode,
  deleteQRCode,
} from '@/lib/APIServices/QRCode/api';

// Utility function to handle API errors
const extractErrorMessage = (err) =>
  err?.message || 'An unexpected error occurred. Please try again.';

export function useQRCodes(searchTerm) {
  const [qrCodes, setQRCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Default is false
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQRCodes = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await getAllQRCodes(searchTerm);
        setQRCodes(response?.data || []); // Fallback to an empty array
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRCodes();
  }, [searchTerm]); // React to searchTerm changes

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllQRCodes(searchTerm);
      setQRCodes(response?.data || []);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQRCodeById = async (qrId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await getQRCodeById(qrId);
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err; // Propagate error to caller
    } finally {
      setIsLoading(false);
    }
  };

  const createNewQRCodes = async (quantity, isActive, type = 'student') => {
    try {
      setIsLoading(true);
      setError(null);
      return await generateQRCodes(quantity, isActive, type);
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExistingQRCode = async (qrId, qrData) => {
    try {
      setIsLoading(true);
      setError(null);
      return await updateQRCode(qrId, qrData);
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQRCodeById = async (qrId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await deleteQRCode(qrId);
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    qrCodes,
    isLoading,
    error,
    refetch,
    fetchQRCodeById,
    createNewQRCodes,
    updateExistingQRCode,
    deleteQRCodeById,
  };
}
