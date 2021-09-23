import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { throws } from 'assert'
import { AuthenticationService } from 'src/authentication/authentication.service'
import { EntityAlreadyExist, EntityMethodNotAllowed, EntityNotFoundError, EntityUnauthorized } from 'src/interceptor/error_response.interceptor'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { Constant } from 'src/utils/constant'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginCredentialsDto } from './dto/login-credentials.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UserEmailDto } from './dto/user-email.dto'
import { AuthEntity } from './entities/auth.entity'
import { UserEntity } from './entities/user.entity'
import { GenerateVerificationCode } from './util/generate-verification-code'

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService, private readonly auth: AuthenticationService, private readonly mailService: MailService) { }

	// signup
	async signup(createUserDto: CreateUserDto) {
		// check if username already exist;
		let user = <UserEntity | EntityNotFoundError>await this.getUserByUsername(createUserDto.username);
		if (!(user instanceof EntityNotFoundError)) throw new EntityAlreadyExist(Constant.USERNAME_ALREADY_EXIST);

		// check if email already exist;
		user = <UserEntity | EntityNotFoundError>await this.getUserByEmail(createUserDto.email);
		if (!(user instanceof EntityNotFoundError)) throw new EntityAlreadyExist(Constant.EMAIL_ALREADY_EXIST);

		// hash password save user to db && generate verification code
		user = await this.auth.register(createUserDto);
		const verification_code: number = GenerateVerificationCode();

		// store code in auth db
		const newAuth = await this.prisma.auth.create({ data: { code: verification_code, user: { connect: { id: user.id } } } });
		await this.prisma.$disconnect();

		if (!newAuth) throw new HttpException(Constant.GENERAL_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR)

		//send verification code to usermail
		this.mailService.sendUserVerificationCode(user, verification_code)

		// success
		return { message: "Signup Success" };
	}

	// verify user account
	async verifyAccountEmail(code: number) {
		// validating confirmation code
		const authCode: AuthEntity = await this.getAuthByCode(code);
		if (!authCode) throw new BadRequestException('Invalid Code');

		// check if user is verified
		if (authCode.user.is_verified) {
			// delete verification code
			await this.prisma.auth.update({ where: { id: authCode.id }, data: { code: null } });
			throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
		}

		// update user verified
		await this.prisma.user.update({ where: { id: authCode.userId }, data: { is_verified: true } });

		// delete verification code
		await this.prisma.auth.update({ where: { id: authCode.id }, data: { code: null } });
		return { message: 'account verified' };
	}

	// request reset password
	async requestResetPassword(userEmailDto: UserEmailDto) {
		// verify if user exist
		const user = await this.getUserByEmail(userEmailDto.email);
		if (user instanceof EntityNotFoundError) throw new EntityNotFoundError(Constant.USER_NOT_FOUND);

		this.generateAndSendVerificationCode(user);

		// success
		return { message: "verification code sent successfully to email" };
	}

	// reset password
	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		// validating confirmation code
		const authCode: AuthEntity = await this.getAuthByCode(resetPasswordDto.code);
		if (!authCode) throw new BadRequestException('Invalid Code');

		// hash new password
		const newHashedPassword = await AuthenticationService.hashPassword(resetPasswordDto.password);

		// update user password
		await this.prisma.user.update({ where: { id: authCode.userId }, data: { password: newHashedPassword } });
		await this.prisma.$disconnect();

		return { message: "User password successfully updated" };
	}

	async login(loginCredentialsDto: LoginCredentialsDto) {
		// validate user credentials
		const user = await this.getUserByUsername(loginCredentialsDto.username);
		if (user instanceof EntityNotFoundError) throw new EntityNotFoundError(Constant.INVALID_CREDENTIALS);

		// validate user password
		const isValidPassword: boolean = await AuthenticationService.compareHashedPassword(user, loginCredentialsDto.password);
		if (!isValidPassword) throw new EntityNotFoundError(Constant.INVALID_CREDENTIALS);

		// check if user is verified
		if (!user.is_verified) {
			this.generateAndSendVerificationCode(user);
			throw new EntityMethodNotAllowed(Constant.ACCOUNT_EMAIL_NOT_VERIFIED);
		}

		// sign a new token
		const jwt: string = ''



	}

	private async getUserByUsername(username: string): Promise<UserEntity | EntityNotFoundError> {
		const user = await this.prisma.user.findUnique({ where: { username: username } });
		await this.prisma.$disconnect();

		if (user) return user;

		return new EntityNotFoundError(Constant.USER_NOT_FOUND);
	};

	private async getUserByEmail(email: string): Promise<UserEntity | EntityNotFoundError> {
		const user = await this.prisma.user.findUnique({ where: { email: email } });
		await this.prisma.$disconnect();

		if (user) return user;

		return new EntityNotFoundError(Constant.USER_NOT_FOUND);
	};

	private async getAuthByCode(code: number) {
		const auth = await this.prisma.auth.findFirst({ where: { code }, include: { user: true } });
		await this.prisma.$disconnect()

		return auth;
	};

	private async generateAndSendVerificationCode(user: UserEntity) {
		// generated and send verification code to user email
		const verification_code: number = GenerateVerificationCode();

		// store code in auth db
		const newAuth = await this.prisma.auth.update({ where: { userId: user.id }, data: { code: verification_code } });
		await this.prisma.$disconnect();

		if (!newAuth) throw new HttpException(Constant.GENERAL_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR)

		//send verification code to usermail
		this.mailService.sendUserVerificationCode(user, verification_code)
	};

}
