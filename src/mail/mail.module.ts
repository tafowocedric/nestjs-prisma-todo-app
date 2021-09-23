import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

const mailerOptions = {
	transport: {
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT),
		secure: Boolean(process.env.IS_SMTP_SECRET),
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD
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
