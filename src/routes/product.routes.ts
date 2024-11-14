import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const productRoutes = express.Router();

productRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createProduct)
  .get(getAllProducts);
productRoutes
  .route('/:id')
  .get(getProductById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateProduct)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteProduct);

export default productRoutes;
