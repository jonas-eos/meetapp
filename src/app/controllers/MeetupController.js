/**
 * @overview Meetup Controller
 * This is the Meetup controller.
 *
 * To create a new meetup, the organizer must inform some requires field that is
 * required in File Validation {@link/validations/FileValidations}
 * After that, the meetup date pass to a new validation, and the event data must
 * be 2 weeks on advance from today.
 *
 * @requires app/models
 *
 * @requires app/validatons/FileValidations
 *
 */
import { startOfHour, isBefore, parseISO, addWeeks } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/Files';
import MeetupValidations from '../validations/MeetupValidations';

class MeetupController {
  async store(req, res) {
    // Validate fields
    await MeetupValidations.validateStore(req);

    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    const { banner: banner_id, title, description, address, date } = req.body;
    const organizer_id = req.userId;
    const hourStart = startOfHour(parseISO(date));

    // Check if start hour is two weeks in advance.
    if (isBefore(hourStart, addWeeks(new Date(), 2))) {
      return res
        .status(400)
        .json({ error: 'You must create a meetup in two weeks in advance!' });
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
    if (!isBefore(addWeeks(new Date(), 2), meetupDate)) {
      return res.status(400).json({
        error: 'You can only change the meetup date in two weeks in advance!',
      });
    }

    // Get new date if exists
    const meetupNewDate = startOfHour(parseISO(date));

    // Check if the new date is a valid date.
    if (isBefore(meetupNewDate, addWeeks(new Date(), 2))) {
      return res.status(400).json({
        error: 'The new date must be in two weeks in advance!',
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

    return res.json(meetup);
  }
}

export default new MeetupController();
