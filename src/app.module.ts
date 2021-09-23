import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';
import { AuthenticationService } from './authentication/authentication.service';
import { UsersService } from './users/users.service';
import { LoggerMiddleware } from './utils/logger.middleware';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
	// imports: [PrismaModule, TodosModule, UsersModule, AuthenticationModule],
	// controllers: [AppController],
	// providers: [AppService, AuthenticationService, UsersService],
	// exports: [AuthenticationService]
	imports: [PrismaModule, UsersModule, MailModule],
	controllers: [AppController],
	providers: [AppService, MailService]
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
