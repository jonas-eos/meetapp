/**
 * @overview Queue handler
 * This file has rules to create and how to handle all jobs created.
 *
 * @requires bee-queue
 *
 * @requires src/config/redis
 * @requires app/jobs/SubscriptionMail
 */
import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import SubscriptionMail from '../app/jobs/SubscriptionMail';

// All job list to handle.
const jobs = [SubscriptionMail];

class Queue {
  /**
   * @constructor
   *
   * @description
   * Start a new queue.
   */
  constructor() {
    this.queues = {};

    this.init();
  }

  /**
   * @method init
   *
   * @description
   * This method start a connectin to redis with the key ID.
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * @method add
   *
   * @description
   * This method add a new queue to be processed.
   *
   * @param queue
   * @param job
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * @method processQueue
   *
   * @description
   * This method process all queue saved in queue.
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  /**
   * @method handleFailure
   *
   * @description
   * Catch an error from a job and return information about that error.
   */
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
