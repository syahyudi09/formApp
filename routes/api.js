import express, { Router } from 'express';
import AuthController from '../controller/AuthController.js';
import jwtAuth from '../middleware/JwtAuth.js';
import FormController from '../controller/FormController.js';
import QuestionController from '../controller/QuestionController.js';
import OptionController from '../controller/OptionController.js';

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
route.get('/forms/:id/users', jwtAuth(), FormController.showToUser)
route.post('/forms', jwtAuth(), FormController.store)
route.get('/forms/:id', jwtAuth(), FormController.show)
route.put('/forms/:id', jwtAuth(), FormController.update)
route.delete('/forms/:id', jwtAuth(), FormController.destroy)

// Question
route.get('/forms/:id/question', jwtAuth(), QuestionController.index)
route.post('/forms/:id/question', jwtAuth(), QuestionController.store)
route.put('/forms/:id/question/:questionId', jwtAuth(), QuestionController.update)
route.delete('/forms/:id/question/:questionId', jwtAuth(), QuestionController.destroy)

// Option
route.post('/forms/:id/question/:questionId/options', jwtAuth(), OptionController.store)
route.put('/forms/:id/question/:questionId/options/:optionId', jwtAuth(), OptionController.update)
route.delete('/forms/:id/question/:questionId/options/:optionId', jwtAuth(), OptionController.destroy)


export default route;
