/**
 * @overview routes
 * Application Routing
 *
 * This file initializes the links between route controllers and the express
 * HTTP server.
 *
 * @requires express
 * @requires multer
 *
 * @requires /config/multer
 * @requires /app/middlewares/auth
 * @requires /app/controllers
 */
import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './app/middleware/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import EventController from './app/controllers/EventController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.destroy);

routes.get('/events', EventController.index);

routes.post('/meetups/:id/register', SubscriptionController.store);
routes.get('/subscriptions', SubscriptionController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
