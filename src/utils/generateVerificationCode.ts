import crypto from 'crypto';

export const generateVerificationCode = (): string => {
  return crypto.randomBytes(3).toString('hex'); // Generates a random 6-character hex code
};
