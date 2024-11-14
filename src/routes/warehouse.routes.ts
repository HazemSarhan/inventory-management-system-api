import express from 'express';
import {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
} from '../controllers/warehouse.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const warehouseRoutes = express.Router();

warehouseRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createWarehouse)
  .get(getAllWarehouses);
warehouseRoutes
  .route('/:id')
  .get(getWarehouseById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateWarehouse)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteWarehouse);

export default warehouseRoutes;
