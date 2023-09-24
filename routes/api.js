import express, { Router } from 'express';
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
route.get('/forms', jwtAuth(), FormController.index)
route.post('/forms', jwtAuth(), FormController.store)
route.get('/forms/:id', jwtAuth(), FormController.show)
route.put('/forms/:id', jwtAuth(), FormController.update)
route.delete('/forms/:id', jwtAuth(), FormController.destroy)


export default route;
