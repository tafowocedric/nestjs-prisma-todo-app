import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) { };

	async sendUserVerificationCode(user: UserEntity, code: number) {
		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Welcome to Univers Todo App! Use this code to confirm your Email',
			html: `<h4>Hi ${user.username}!</h4>
				<p>confirmation code: <strong><i>${code}</i></strong></p>
			`
		})
	}
}
