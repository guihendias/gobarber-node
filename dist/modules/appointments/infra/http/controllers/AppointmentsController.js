"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CreateAppointmentService = _interopRequireDefault(require("../../../services/CreateAppointmentService"));

var _tsyringe = require("tsyringe");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppointmentsController {
  async create(request, response) {
    const user_id = request.user.id;
    const {
      provider_id,
      date
    } = request.body;

    const createAppointment = _tsyringe.container.resolve(_CreateAppointmentService.default);

    const appointment = await createAppointment.execute({
      provider_id,
      date,
      user_id
    });
    return response.json(appointment);
  }

}

exports.default = AppointmentsController;