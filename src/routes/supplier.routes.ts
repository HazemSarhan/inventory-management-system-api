import express from 'express';
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplier.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const supplierRoutes = express.Router();

supplierRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createSupplier)
  .get(getAllSuppliers);
supplierRoutes
  .route('/:id')
  .get(getSupplierById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateSupplier)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteSupplier);

export default supplierRoutes;
