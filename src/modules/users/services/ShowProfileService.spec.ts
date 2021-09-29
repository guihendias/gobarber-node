import CreateUserService from './CreateUserService';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

describe('UpdateProfile', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let showProfile: ShowProfileService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const profile = await showProfile.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
    });

    it('should not be able to show the profile from non existing user', async () => {
        await expect(
            showProfile.execute({
                user_id: 'non-existing',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
