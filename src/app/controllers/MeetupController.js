/**
 * @overview Meetup Controller
 * This is the Meetup controller.
 *
 * Show all event to the current user token. Will be listed 5 events per page.
 *
 * To create a new meetup, the organizer must inform some requires field that is
 * required in File Validation {@link/validations/FileValidations}
 * After that, the meetup date pass to a new validation, and the event data must
 * be 1 hour on advance from today.
 *
 * To update an event, is only allowed if you are changing the event with two
 * weeks of attention.
 *
 * To delete an event, the user must be the meetup organizer.
 *
 * @requires date-fns
 * @requires sequelize
 *
 * @requires app/models *
 * @requires app/validatons/FileValidations
 */
import { startOfHour, isBefore, parseISO, addHours } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import File from '../models/Files';
import MeetupValidations from '../validations/MeetupValidations';

class MeetupController {
  // GET :: /meetups
  async index(req, res) {
    const page = req.query.page || 1;

    const meetups = await Meetup.findAll({
      where: {
        organizer_id: req.userId,
        date: { [Op.gt]: new Date() },
      },
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['url'],
        },
      ],
      limit: 5,
      offset: 5 * page - 5,
    });

    return res.json(meetups);
  }

  // POST :: /meetups
  async store(req, res) {
    // Validate fields
    await MeetupValidations.validateStore(req);

    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    const { banner: banner_id, title, description, address, date } = req.body;
    const organizer_id = req.userId;
    const hourStart = startOfHour(parseISO(date));

    // Check if start hour is one hour in advance.
    if (isBefore(hourStart, addHours(new Date(), 1))) {
      return res
        .status(400)
        .json({ error: 'You must create a meetup in one hour in advance!' });
    }

    // Check if the banner exists
    const banner = await File.findOne({
      where: {
        id: banner_id,
      },
    });
    if (!banner) {
      return res.status(406).json({ error: 'This banner does not exists!' });
    }

    const meetup = await Meetup.create({
      organizer_id,
      banner_id,
      title,
      description,
      address,
      date: hourStart,
    });

    return res.json(meetup);
  }

  // PUT :: /meetups/:id
  async update(req, res) {
    // Validate fields
    await MeetupValidations.validateUpdate(req);

    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    const { id } = req.params;
    const organizer = req.userId;

    // Find event by ID
    const meetup = await Meetup.findByPk(id);

    // Check if event exists
    if (!meetup) {
      return res.status(400).json({ error: 'This event does not exists!' });
    }

    // Check if the user is the event organizer
    if (meetup.organizer_id !== organizer) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to change this event!' });
    }

    // Get values from body
    let { title, description, banner, address } = req.body;
    const { date } = req.body;

    // Get meetupDate
    const meetupDate = startOfHour(Number(meetup.date));

    // Check if the event can be changed
    if (!isBefore(addHours(new Date(), 1), meetupDate)) {
      return res.status(400).json({
        error: 'You can only change the meetup date in one hour in advance!',
      });
    }

    // Get new date if exists
    const meetupNewDate = startOfHour(parseISO(date));

    // Check if the new date is a valid date.
    if (isBefore(meetupNewDate, addHours(new Date(), 1))) {
      return res.status(400).json({
        error: 'The new date must be in one hour in advance!',
      });
    }

    /**
     * Validate if the field are blank, then get the field from database
     * This prevent crash on update blank values
     */
    if (!title) {
      title = meetup.title;
    }
    if (!description) {
      description = meetup.description;
    }
    if (!banner) {
      banner = meetup.banner_id;
    }
    if (!address) {
      address = meetup.address;
    }

    // Update meetup
    await meetup.update({
      title,
      description,
      date,
      banner_id: banner,
      address,
    });

    const { banner_url } = await Meetup.findByPk(id, {
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['url'],
        },
      ],
    });

    return res.json(meetup, banner_url);
  }

  // DELETE :: /meetups/:id
  async destroy(req, res) {
    const organizer = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(404).json({ error: 'Event does not exist!' });
    }

    if (isBefore(Number(meetup.date), Number(new Date()))) {
      return res
        .status(400)
        .json({ error: 'You can not cancel a past event!' });
    }

    if (!meetup)
      if (meetup.organizer_id !== organizer) {
        return res.status(401).json({
          error: 'You can only cancel event in which you are the organizer',
        });
      }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
