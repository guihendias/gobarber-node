import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMAilDTO';

import IMailProvider from '../models/IMailProvider';

interface Message {
    to: string;
    body: string;
}

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });

            this.client = transporter;
        });
    }

    public async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const msg = await this.client.sendMail({
            to: {
                name: to.name,
                address: to.email,
            },
            from: {
                name: from?.name || 'Equipe GoBarber',
                address: from?.email || 'equipe@gobarber.com.br',
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });

        console.log('email', JSON.stringify(msg));
        console.log('Preview URL: ' + nodemailer.getTestMessageUrl(msg));
    }
}
