/**
 * @overview Queue
 * This is the queue server job, to handle jobs send to the queue handler.
 *
 * @requires dotenv/config
 * @requires lib/Queue
 */
import 'dotenv/config';
import Queue from './lib/Queue';

Queue.processQueue();
