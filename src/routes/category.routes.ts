import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/category.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';
const categoryRoutes = express.Router();

categoryRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createCategory)
  .get(getAllCategories);
categoryRoutes
  .route('/:id')
  .get(getCategoryById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateCategory)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteCategory);

export default categoryRoutes;
