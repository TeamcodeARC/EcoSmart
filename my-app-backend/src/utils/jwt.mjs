import jwt from 'jsonwebtoken';

/**
 * Generates a mock JWT token for testing purposes
 * @param {Object} payload - The data to be encoded in the token
 * @returns {string} The generated JWT token
 */
export const generateMockToken = (payload = {}) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-here';
  const defaultPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: 'user',
    ...payload
  };
  
  const options = {
    expiresIn: '1h',
    issuer: 'ecosmart-api',
    audience: 'testing'
  };

  return jwt.sign(defaultPayload, secret, options);
};