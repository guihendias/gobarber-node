import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

describe('ListProviderDayAvailability', () => {
    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let listProviderDayAvailability: ListProviderDayAvailabilityService;

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository
        );
    });

    it('should be able to list the day availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 7, 24, 14, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2021, 7, 24, 15, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 7, 24, 11).getTime();
        });

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            day: 24,
            year: 2021,
            month: 8,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
            ])
        );
    });
});
