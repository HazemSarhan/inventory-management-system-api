import { Request, Response, NextFunction } from 'express';
import { isTokenValid } from '../utils';
import { UnauthenticatedError, UnauthorizedError } from '../errors';

interface UserPayload {
  name: string;
  userId: string;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies?.token;

  if (!token) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

export const authorizePermissions = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};
