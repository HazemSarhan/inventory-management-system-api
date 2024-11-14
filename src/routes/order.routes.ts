import express from 'express';
import {
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  getAllPurchaseOrders,
  getPurchaseOrderById,
} from '../controllers/order.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const orderRoutes = express.Router();

orderRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createPurchaseOrder)
  .get(
    [authenticatedUser, authorizePermissions('ADMIN')],
    getAllPurchaseOrders,
  );
orderRoutes
  .route('/:id')
  .get([authenticatedUser, authorizePermissions('ADMIN')], getPurchaseOrderById)
  .patch(
    [authenticatedUser, authorizePermissions('ADMIN')],
    updatePurchaseOrderStatus,
  );

export default orderRoutes;
