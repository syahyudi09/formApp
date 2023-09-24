import express from 'express';
import AuthController from '../controller/AuthController.js';
import jwtAuth from '../middleware/JwtAuth.js';
import FormController from '../controller/FormController.js';

const route = express.Router();

route.get('/', (req, res) => {
  res.json({ title: 'Hello World' });
});

// Auth
route.post('/register', AuthController.register)
route.post('/login', AuthController.login)
route.post('/refresh-token', jwtAuth(), AuthController.refreshToken)

// Form
route.post('/forms', jwtAuth(), FormController.store)

export default route;
