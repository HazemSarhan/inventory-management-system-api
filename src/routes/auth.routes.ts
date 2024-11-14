import express from 'express';
import { login, logout, register } from '../controllers/auth.controller';
const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/logout', logout);

export default authRoutes;
