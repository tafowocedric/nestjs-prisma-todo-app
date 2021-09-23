import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [AuthenticationModule, MailModule]
})
export class UsersModule { }
