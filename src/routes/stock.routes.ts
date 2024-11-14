import express from 'express';
import {
  addStockMovement,
  getAllStockMovements,
  getStockMovementById,
} from '../controllers/stock.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const stockRoutes = express.Router();

stockRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], addStockMovement)
  .get(
    [authenticatedUser, authorizePermissions('ADMIN')],
    getAllStockMovements,
  );

stockRoutes
  .route('/:id')
  .get(
    [authenticatedUser, authorizePermissions('ADMIN')],
    getStockMovementById,
  );

export default stockRoutes;
