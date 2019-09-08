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
import MeetupValidations from '../validations/MeetupValidations';

class MeetupController {
  async store(req, res) {
    // Validate fields
    await MeetupValidations.validateStore(req);

    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    const { date } = req.body;

    const hourStart = startOfHour(parseISO(date));
    // Check if start hour is two weeks in advance.
    if (isBefore(hourStart, addWeeks(new Date(), 2))) {
      return res
        .status(400)
        .json({ error: 'You must create a meetup in two weeks in advance!' });
    }

    return res.json({
      body: req.body,
      orginizer: req.userId,
      hourstart: hourStart,
    });
  }
}

export default new MeetupController();
