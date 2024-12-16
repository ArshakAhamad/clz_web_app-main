import { verifyToken } from '../config/auth.js';
import { getUserById, getRoleById } from '../models/User.js';

export const authenticate = async (req, res, next) => {
/*
  const authHeader = req.headers['authorization'];
  //console.log('Authorization Header:', authHeader); // Log the entire header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      //console.log('No token provided');
      return res.status(403).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
*/
const token = req.headers.authorization?.split(' ')[1];
const cookieToken = req.cookies.accessToken;

  if (!token) {
      //console.log('Token is malformed or empty');
      return res.status(403).json({ message: 'Token is malformed or empty' });
  }

  try {
      const decoded = verifyToken(token);
      //console.log('Decoded token:', decoded);
      const user = await getUserById(decoded.userId);

      if (!user || user.token !== token) {
          //console.log('Unauthorized or invalid token:', { user, token });
          return res.status(401).json({ message: 'Unauthorized or invalid token' });
      }
      req.user = decoded; // Attach user information to request object
      req.userId = decoded.userId;
      req.roleId = decoded.roleId;
      //req.roleName = await getRoleById(decoded.roleId);
      req.username = decoded.username;
      req.email = decoded.email;
      /*
      console.log('User:', req.user);
      console.log('User ID:', req.userId);
      console.log('Role ID:', req.roleId);
      console.log('Role Name:', req.roleName);
      console.log('Username:', req.username);
      console.log('Email:', req.email);
      */
      next();
  } catch (error) {
      //console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Unauthorized' });
  }
};
