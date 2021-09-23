import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginCredentialsDto {
	@IsNotEmpty() @MinLength(2) username: string
	@IsNotEmpty() @MinLength(3) password: string
}
