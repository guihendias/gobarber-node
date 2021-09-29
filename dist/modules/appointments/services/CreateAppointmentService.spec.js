"use strict";

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CreateAppointment', () => {
  let fakeAppointmentsRepository;
  let fakeNotificationsRepository;
  let fakeCacheProvider;
  let createAppointment;
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationsRepository = new _FakeNotificationsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointment = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 26, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2021, 7, 26, 13),
      provider_id: '123123123',
      user_id: '321321'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });
  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 26, 12).getTime();
    });
    const appointmentDate = new Date(2021, 7, 26, 13);
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
      user_id: '312312'
    });
    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
      user_id: '321321'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 26, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2021, 5, 20, 12),
      provider_id: '123123123',
      user_id: '321321'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 26, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2021, 5, 20, 13),
      provider_id: '123123123',
      user_id: '123123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 7, 26, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2021, 7, 27, 7),
      provider_id: 'user-id',
      user_id: 'provider-id'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointment.execute({
      date: new Date(2021, 7, 27, 18),
      provider_id: 'user-id',
      user_id: 'provider-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});