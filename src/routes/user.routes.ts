import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserPassword,
  updateUserRole,
} from '../controllers/user.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';
const userRoutes = express.Router();

userRoutes.route('/').get(getAllUsers);
userRoutes
  .route('/:id/updatePassword')
  .patch([authenticatedUser], updateUserPassword);
userRoutes
  .route('/:id/updateRole')
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateUserRole);
userRoutes
  .route('/:id')
  .get(getUserById)
  .patch([authenticatedUser], updateUserData);

export default userRoutes;
