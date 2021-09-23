import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Constant } from 'src/utils/constant';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthenticationService {
	constructor(private readonly prisma: PrismaService) { };

	async register(credential: CreateUserDto) {

		// hash password
		const hashedPassword = await AuthenticationService.hashPassword(credential.password);

		try {
			// create record on db
			const user = await this.prisma.user.create({ data: { ...credential, password: hashedPassword } });
			await this.prisma.$disconnect();

			return user;

		} catch (error) {
			console.error(error);
			throw new HttpException(Constant.GENERAL_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	static hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, parseInt(process.env.SALT));
	}

	static compareHashedPassword(user: UserEntity, password: string): Promise<boolean> {
		return bcrypt.compare(password, user.password);
	}

}
