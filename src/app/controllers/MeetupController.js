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
}

export default new MeetupController();
