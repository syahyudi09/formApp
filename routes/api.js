import express from 'express';
import AuthController from '../controller/AuthController.js';

const route = express.Router();

route.get('/', (req, res) => {
  res.json({ title: 'Hello World' });
});

route.post('/register', AuthController.register)
route.post('/login', AuthController.login)
route.post('/refresh-token', AuthController.refreshToken)

export default route;
