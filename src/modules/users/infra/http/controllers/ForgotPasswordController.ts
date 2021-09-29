import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ForgotPasswordController {
    async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const sendForgotPasswordEmailService = container.resolve(
            SendForgotPasswordEmailService
        );

        await sendForgotPasswordEmailService.execute({
            email,
        });

        return response.status(204).json();
    }
}
