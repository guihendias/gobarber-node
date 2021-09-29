import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

interface ReturnUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    password?: string;
    created_at: Date;
    updated_at: Date;
}

export default class UsersController {
    async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUserService);

        const user: ReturnUser = await createUser.execute({
            name,
            email,
            password,
        });

        return response.json(classToClass(user));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);

        const user: ReturnUser = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        return response.json(classToClass(user));
    }
}
