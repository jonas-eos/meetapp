/**
 * @overview Event Controller
 * This is the Event controller.
 *
 * Show all events to the current user token. Will be listed 10 events per page.
 * The events will be filter by Data query.
 *
 * @requires date-fns
 * @requires sequelize
 *
 * @requires app/models *
 */
import { parseISO, endOfDay, startOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import File from '../models/Files';
import User from '../models/Users';

class EventController {
  // GET :: /events
  async index(req, res) {
    const page = req.query.page || 1;
    const where = {};
    const searchDate = parseISO(req.query.date);

    where.date = {
      [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
    };

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['url'],
        },
      ],
      attributes: ['title', 'description', 'address', 'date'],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }
}

export default new EventController();
