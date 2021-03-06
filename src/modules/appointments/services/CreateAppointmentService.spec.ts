import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

describe('CreateAppointment', () => {
    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let fakeNotificationsRepository: FakeNotificationsRepository;
    let fakeCacheProvider: FakeCacheProvider;

    let createAppointment: CreateAppointmentService;

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 7, 26, 12).getTime();
        });
        const appointment = await createAppointment.execute({
            date: new Date(2021, 7, 26, 13),
            provider_id: '123123123',
            user_id: '321321',
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
            user_id: '312312',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '123123123',
                user_id: '321321',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 7, 26, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 5, 20, 12),
                provider_id: '123123123',
                user_id: '321321',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 7, 26, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 5, 20, 13),
                provider_id: '123123123',
                user_id: '123123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2021, 7, 26, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2021, 7, 27, 7),
                provider_id: 'user-id',
                user_id: 'provider-id',
            })
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2021, 7, 27, 18),
                provider_id: 'user-id',
                user_id: 'provider-id',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
