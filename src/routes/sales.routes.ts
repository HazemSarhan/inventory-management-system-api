import express from 'express';
import {
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderById,
  updateSalesOrderStatus,
  deleteSalesOrder,
} from '../controllers/sales.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const salesRoutes = express.Router();

salesRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createSalesOrder)
  .get([authenticatedUser, authorizePermissions('ADMIN')], getAllSalesOrders);

salesRoutes
  .route('/:id')
  .get([authenticatedUser, authorizePermissions('ADMIN')], getSalesOrderById)
  .patch(
    [authenticatedUser, authorizePermissions('ADMIN')],
    updateSalesOrderStatus,
  )
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteSalesOrder);
export default salesRoutes;
