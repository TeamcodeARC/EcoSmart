import { verifyToken } from '../utils/auth'; // Example utility for token verification

// Middleware for authentication
export const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  verifyToken(token)
    .then(decoded => {
      req.user = decoded;
      next();
    })
    .catch(err => {
      return res.status(401).json({ message: 'Unauthorized', error: err });
    });
};

// Middleware for logging requests
export const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Middleware for error handling
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};