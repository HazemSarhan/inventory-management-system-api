import express from 'express';
import {
  addPurchaseOrderItem,
  receivePurchaseOrder,
  getAllPurchaseOrderItems,
  getPurchaseOrderItemById,
} from '../controllers/order.item.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const orderItemRoutes = express.Router();

orderItemRoutes.route('/').get([authenticatedUser], getAllPurchaseOrderItems);

orderItemRoutes
  .route('/:id/add')
  .post(
    [authenticatedUser, authorizePermissions('ADMIN')],
    addPurchaseOrderItem,
  );
orderItemRoutes
  .route('/:id/receive')
  .post(
    [authenticatedUser, authorizePermissions('ADMIN')],
    receivePurchaseOrder,
  );

orderItemRoutes
  .route('/:id')
  .get([authenticatedUser], getPurchaseOrderItemById);

export default orderItemRoutes;
