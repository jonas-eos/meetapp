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
 * @require express
 *
 * @require ./routes
 * @require ./database
 *
 * @license MIT
 */
import express from 'express';

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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
