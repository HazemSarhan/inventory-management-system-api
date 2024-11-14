import express from 'express';
import {
  addSalesOrderItem,
  receiveSalesOrderItem,
  getAllSalesOrderItems,
  getSalesOrderItemById,
  deleteSalesOrderItem,
} from '../controllers/sales.item.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const salesItemRoutes = express.Router();

salesItemRoutes
  .route('/')
  .get(
    [authenticatedUser, authorizePermissions('ADMIN')],
    getAllSalesOrderItems,
  );

salesItemRoutes
  .route('/:id/add')
  .post([authenticatedUser, authorizePermissions('ADMIN')], addSalesOrderItem);

salesItemRoutes
  .route('/:id/receive')
  .post(
    [authenticatedUser, authorizePermissions('ADMIN')],
    receiveSalesOrderItem,
  );

salesItemRoutes
  .route('/:id')
  .get(
    [authenticatedUser, authorizePermissions('ADMIN')],
    getSalesOrderItemById,
  )
  .delete(
    [authenticatedUser, authorizePermissions('ADMIN')],
    deleteSalesOrderItem,
  );

export default salesItemRoutes;
