import conn from "../config/db.js";

// Function to create a new student
export const createStudent = async (studentData) => {
  const roleId = await checkStudentRole();
  const [result] = await conn.execute(
    `INSERT INTO student (
      name, email, gender, addressDistrict, addressCity, addressRoad, roleId, 
      registeredDate, birthDay, phoneNumber1, phoneNumber2, studentQRCode, freeCard
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentData.name,
      studentData.email,
      studentData.gender,
      studentData.addressDistrict,
      studentData.addressCity,
      studentData.addressRoad,
      roleId,
      studentData.registeredDate,
      studentData.birthDay,
      studentData.phoneNumber1,
      studentData.phoneNumber2 || null,
      studentData.studentQRCode,
      studentData.freeCard,
    ]
  );
  return result.insertId; // Return the ID of the newly created student
};

// Function to check the role ID for students
const checkStudentRole = async () => {
  const [role] = await conn.execute(
    `SELECT roleId FROM role WHERE roleName = "student"`
  );
  if (role.length === 0) {
    throw new Error("Role not found.");
  }
  return role[0].roleId;
};

// Function to get all students
export const getAllStudents = async () => {
  const [rows] = await conn.execute("SELECT * FROM student");
  return rows;
};

// Function to get a student by ID
export const getStudentById = async (studentId) => {
  const [rows] = await conn.execute(
    "SELECT * FROM student WHERE studentId = ?",
    [studentId]
  );
  return rows[0];
};

// Function to get a student by QR code
export const getStudentByQRCode = async (studentQRCode) => {
  const [rows] = await conn.execute(
    "SELECT * FROM student WHERE studentQRCode = ?",
    [studentQRCode]
  );
  return rows[0] || null;
};

// Function to check if the student is enrolled in a class
export const isStudentEnrolledInClass = async (studentId, classId) => {
  const [rows] = await conn.execute(
    `SELECT 1 FROM student_class WHERE studentId = ? AND classId = ?`,
    [studentId, classId]
  );
  return rows.length > 0; // Returns true if enrolled
};

// Function to enroll a student in a class
export const enrollStudentInClass = async (studentId, classId, studentQRCode) => {
  await conn.execute(
    `INSERT INTO student_class (studentId, classId, studentQRCode, studentStatus) VALUES (?, ?, ?, 1)`,
    [studentId, classId, studentQRCode]
  );
};

// Function to get student ID by partial name
export const getStudentIdByPartialName = async (partialName, birthDay, phoneNumber1) => {
  const [students] = await conn.execute(
    `SELECT studentId FROM student WHERE name LIKE ? AND birthDay = ? AND phoneNumber1 = ?`,
    [`%${partialName}%`, birthDay, phoneNumber1]
  );

  if (students.length === 0) {
    throw new Error("Student not found with the provided details.");
  }
  if (students.length > 1) {
    throw new Error(
      "Multiple students found with the provided details. Provide more specific data."
    );
  }
  return students[0].studentId;
};

// Function to update the QR code of a student
export const updateStudentQRCode = async (studentId, newQRCode) => {
  await conn.execute(`UPDATE student SET studentQRCode = ? WHERE studentId = ?`, [
    newQRCode,
    studentId,
  ]);
  await conn.execute(
    `UPDATE student_class SET studentQRCode = ? WHERE studentId = ?`,
    [newQRCode, studentId]
  );
  return { message: "Student QR code updated successfully." };
};

// Function to update student details
export const updateStudentDetails = async (studentId, updatedData) => {
  const {
    name,
    email,
    gender,
    addressDistrict,
    addressCity,
    addressRoad,
    birthDay,
    phoneNumber1,
    phoneNumber2,
    freeCard,
  } = updatedData;
  await conn.execute(
    `UPDATE student SET 
      name = ?, email = ?, gender = ?, addressDistrict = ?, 
      addressCity = ?, addressRoad = ?, birthDay = ?, phoneNumber1 = ?, 
      phoneNumber2 = ?, freeCard = ? WHERE studentId = ?`,
    [
      name,
      email,
      gender,
      addressDistrict,
      addressCity,
      addressRoad,
      birthDay,
      phoneNumber1,
      phoneNumber2 || null,
      freeCard,
      studentId,
    ]
  );
  return { message: "Student details updated successfully." };
};
