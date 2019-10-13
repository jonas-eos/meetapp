/**
 * @overview meetapp
 * This is a developer event aggregator app.
 *
 * It is responsible for setting up the  * HTTP server. These are global
 * throughout the application, and are configured
 * here.
 *
 * The application routes are configured in {@link src/routes}, while
 * the middleware is configured in {@link src/app.js}, and
 * server states in {@link src/server}
 *
 * @requires express
 * @requires dotenv/config
 * @requires path
 *
 * @requires ./routes
 * @requires ./database
 *
 * @license MIT
 */
import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';

import routes from './routes';

import './database';

class App {
  /**
   * @constructor
   *
   * @description
   * Create a new express server and start middlewares and routes.
   */
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
