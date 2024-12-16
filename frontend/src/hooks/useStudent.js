import { useState, useEffect } from 'react';
import {
  createStudent,
  getAllStudents,
  getStudentByQRCode,
  updateStudent,
} from '@/lib/APIServices/Student/api';

export function useStudents(searchTerm = '') {
  const [students, setStudents] = useState([]); // Store fetched students
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Store errors

  // Fetch all students based on the searchTerm
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      const response = await getAllStudents(searchTerm);
      setStudents(response?.data || []); // Fallback to empty array if no data
    } catch (err) {
      console.error('Error fetching students:', err.message);
      setError(err.message || 'Failed to fetch students.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch students manually (can be called from components)
  const refetchStudents = async () => {
    await fetchStudents();
  };

  // Fetch students when the component mounts or searchTerm changes
  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

  // Function to create a new student
  const createNewStudent = async (studentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createStudent(studentData);
      await refetchStudents(); // Refetch the updated list of students
      return result;
    } catch (err) {
      console.error('Error creating student:', err.message);
      setError(err.message || 'Failed to create student.');
      throw err; // Rethrow the error for handling in components
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch a student by QR code
  const fetchStudentByQRCode = async (qrCode) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getStudentByQRCode(qrCode);
      return result;
    } catch (err) {
      console.error('Error fetching student by QR code:', err.message);
      setError(err.message || 'Failed to fetch student by QR code.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update an existing student
  const updateExistingStudent = async (studentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateStudent(studentData);
      await refetchStudents(); // Refetch the updated list of students
      return result;
    } catch (err) {
      console.error('Error updating student:', err.message);
      setError(err.message || 'Failed to update student.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    students,     // List of students
    isLoading,    // Loading state
    error,        // Error state
    refetchStudents, // Function to refetch students
    createNewStudent, // Function to create a new student
    fetchStudentByQRCode, // Function to fetch a student by QR code
    updateExistingStudent, // Function to update a student
  };
}
