import express from 'express';
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customer.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const customerRoutes = express.Router();

customerRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createCustomer)
  .get(getAllCustomers);
customerRoutes
  .route('/:id')
  .get(getCustomerById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateCustomer)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteCustomer);

export default customerRoutes;
