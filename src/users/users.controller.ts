import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SuccessInterceptor } from 'src/interceptor/success_response.interceptor';
import { UserEmailDto } from './dto/user-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) { };

	@Post('signup')
	@UseInterceptors(new SuccessInterceptor(HttpStatus.CREATED))
	signup(@Body() createUserDto: CreateUserDto): any {
		return this.usersService.signup(createUserDto);
	}

	@Get('code-verification')
	@UseInterceptors(new SuccessInterceptor())
	verifyAccountEmail(@Query('code') code: string) {
		return this.usersService.verifyAccountEmail(+code)
	}

	@Post('request-reset-password')
	@UseInterceptors(new SuccessInterceptor())
	requestResetPassword(@Body() userEmailDto: UserEmailDto) {
		return this.usersService.requestResetPassword(userEmailDto);
	}

	@Post('reset-password')
	@UseInterceptors(new SuccessInterceptor())
	resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.usersService.resetPassword(resetPasswordDto);
	}

	@Post('login')
	@UseInterceptors(new SuccessInterceptor())
	login(@Body() loginCredentialsDto: LoginCredentialsDto) {
		return this.usersService.login(loginCredentialsDto);
	}
}
