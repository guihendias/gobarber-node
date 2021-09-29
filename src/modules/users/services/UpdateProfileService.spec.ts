import CreateUserService from './CreateUserService';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

describe('UpdateProfile', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let updateProfile: UpdateProfileService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    it('should be able to create a new user', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
        });

        expect(user.name).toBe('John Tre');
        expect(user.email).toBe('johntre@example.com');
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'teste',
            email: 'teste@example.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Tre',
                email: 'johndoe@example.com',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Tre',
                email: 'johntre@example.com',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'John Tre',
                email: 'johntre@example.com',
                old_password: 'wrong-password',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update profile from non existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing',
                name: 'John Tre',
                email: 'johntre@example.com',
                old_password: 'wrong-password',
                password: '123123',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
