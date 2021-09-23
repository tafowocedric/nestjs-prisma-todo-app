import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

const mailerOptions = {
	transport: {
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'vegascedrictest@gmail.com',
			pass: 'VrichCrich99'
		}
	},
	defaults: {
		from: '"No Reply" <noreply@example.com>'
	},
}

@Module({
	imports: [MailerModule.forRoot(mailerOptions)],
	providers: [MailService],
	exports: [MailService]
})
export class MailModule { }
