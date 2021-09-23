import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty() @MinLength(2) username: string
	@IsEmail() email: string
	@IsNotEmpty() @MinLength(3) password: string
}
