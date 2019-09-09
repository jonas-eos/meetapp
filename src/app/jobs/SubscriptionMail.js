/**
 * @overview Subscription mail job
 * This file content all rules to send subscription mail, this is a job that is
 * added to the queue to be process with the jobs handler server.
 *
 * @requires date-fns
 * @requires src/lib/Mail
 */
import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class SubscriptionMail {
  /**
   * @property key
   *
   * @description
   * The job name.
   *
   * @return Job property value
   */
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { subscription } = data;

    await Mail.sendMail({
      to: `${subscription.meetup.organizer.name} <${subscription.meetup.organizer.email}>`,
      subject: 'New user subscription notification',
      template: 'subscription',
      context: {
        organizer: subscription.meetup.organizer.name,
        title: subscription.meetup.title,
        user: subscription.user.name,
        email: subscription.user.email,
        date: format(parseISO(subscription.meetup.date), "MMMM dd 'at' h:mm a"),
      },
    });
  }
}

export default new SubscriptionMail();
