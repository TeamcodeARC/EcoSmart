import jwt from 'jsonwebtoken';
import { generateMockToken } from '../utils/jwt.mjs';

export const authenticateToken = (req, res, next) => {
  // Auto-generate mock token in development mode if no token is provided
  if (process.env.NODE_ENV === 'development' && !req.headers['authorization']) {
    const mockToken = generateMockToken();
    req.headers['authorization'] = `Bearer ${mockToken}`;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
