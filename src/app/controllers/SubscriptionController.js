/**
 * @overview Subscription Controller
 * This is the Subscription controller.
 *
 * subscribe the actual user to the meetup, the meetup is defined on id params.
 * The user cannot subscribe to an event that has already happened.
 * The user cannot subscribe to an event that is already subscribed.
 * Orginzer user cannot subscribe to their own event.
 * The user cannot subscribe in more then one event in the same day.
 *
 * @requires date-fns
 *
 * @requires app/models/Meetup
 * @requires app/models/Subscription
 * @requires app/models/User
 * @requires src/lib/Queue
 * @requires app/jobs/SubscriptionMail
 */
import { isBefore } from 'date-fns';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscriptions';
import User from '../models/Users';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  // GET :: /subscriptions
  async index(req, res) {
    return res.send();
  }

  // POST :: '/meetups/:id/subscribe'
  async store(req, res) {
    const { userId: user_id } = req;
    const { id: meetup_id } = req.params;

    const meetup = await Meetup.findOne({
      where: {
        id: meetup_id,
      },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        },
      ],
    });

    // Check if the event exists
    if (!meetup) {
      return res.status(404).json({ error: 'Event does not exists!' });
    }

    // Check if the current user is are the meetup owner
    if (meetup.organizer_id === user_id) {
      return res
        .status(403)
        .json({ error: 'You cannot subscribe in you own meetup!' });
    }

    // Check if the meetup has already happened
    if (isBefore(meetup.date, new Date())) {
      return res.status(403).json({
        error: 'You cannot subscribe to an event that has already happened!',
      });
    }

    let subscription = await Subscription.findOne({
      where: { meetup_id, user_id },
    });

    // Check if user has already subscribed for current event
    if (subscription) {
      return res.status(403).json({
        error: 'You has already subscribed for this meetup!',
      });
    }

    const subsByDay = await Subscription.findOne({
      where: { user_id },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    // Check if user try to subscribe for second event at the same day.
    if (subsByDay) {
      return res.status(403).json({
        error: 'You cannot subscribe for two events at the same day.',
      });
    }

    // Create a subscription
    const subscriptionStatus = await Subscription.create({
      meetup_id: meetup.id,
      user_id,
    });

    // Get return from subscription
    subscription = await Subscription.findOne({
      where: { id: subscriptionStatus.id },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          include: [
            {
              model: User,
              as: 'organizer',
              attributes: ['name', 'email'],
            },
          ],
          attributes: ['date', 'title'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    // Send mail
    await Queue.add(SubscriptionMail.key, {
      subscription,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
