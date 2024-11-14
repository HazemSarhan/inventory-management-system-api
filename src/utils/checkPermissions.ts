import { UnauthorizedError } from '../errors';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

interface User {
  role: UserRole;
  userId: string;
}

export const checkPermission = (
  requestUser: User,
  resourceUserId?: string,
): void => {
  // Allow access if the user is an admin
  if (requestUser.role === UserRole.ADMIN) return;

  // Check if the user owns the resource
  if (requestUser.userId === resourceUserId) return;

  // Otherwise, throw an UnauthorizedError
  throw new UnauthorizedError(
    `User ${requestUser.userId} is not authorized to access this route`,
  );
};
