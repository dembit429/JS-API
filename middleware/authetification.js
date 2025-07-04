import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function generateAccessToken(user) {
 
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role || 'user'
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' });
}


export function authenticateAcessToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; 
    next();
  });
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}


export default {generateAccessToken, authenticateToken: authenticateAcessToken, generateRefreshToken};
