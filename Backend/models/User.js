import conn from '../config/db.js';

export const createUser = async (userData) => {
    const { username, password, roleId, classId, email, phoneNumber1, phoneNumber2, addressDistrict, addressCity, addressRoad, gender, birthday } = userData;
    const query = `INSERT INTO user (username, password, roleId, classId, email, phoneNumber1, phoneNumber2, addressDistrict, addressCity, addressRoad, gender, birthday) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await conn.execute(query, [username, password, roleId, classId, email, phoneNumber1, phoneNumber2, addressDistrict, addressCity, addressRoad, gender, birthday]);
    return result;
};

export const getUserByUsername = async (username) => {
    const [rows] = await conn.execute('SELECT * FROM user WHERE username = ?', [username]);
    return rows[0];
};

export const getUserByEmail = async (email) => {
    const [rows] = await conn.execute('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0];
};

export const getUserById = async (id) => {
    const [rows] = await conn.execute('SELECT * FROM user WHERE userId = ?', [id]);
    return rows[0];
};

export const updateUserToken = async (userId, token) => {
    await conn.execute('UPDATE user SET token = ? WHERE userId = ?', [token, userId]);
};

export const getRoleById = async (roleId) => {
    const [rows] = await conn.execute('SELECT * FROM roles WHERE roleId = ?', [roleId]);
    return rows[0];
};

export const getUsers = async () => {
    const [rows] = await conn.execute('SELECT * FROM user');
    return rows;
};

export const getRoles = async () => {
    const [rows] = await conn.execute('SELECT * FROM role');
    return rows;
};

export const updateUser = async (userId, userData) => {
    const { username, roleId, classId, email, phoneNumber1, phoneNumber2, addressDistrict, addressCity, addressRoad, gender, birthday, active } = userData;
    const query = `UPDATE user SET username = ?, roleId = ?, classId = ?, email = ?, phoneNumber1 = ?, phoneNumber2 = ?, addressDistrict = ?, addressCity = ?, addressRoad = ?, gender = ?, birthday = ?, active = ? WHERE userId = ?`;
    await conn.execute(query, [username, roleId, classId, email, phoneNumber1, phoneNumber2, addressDistrict, addressCity, addressRoad, gender, birthday, active, userId]);
}
