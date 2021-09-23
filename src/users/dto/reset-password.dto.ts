import { IsNotEmpty, IsNumber } from "class-validator";

export class ResetPasswordDto {
	@IsNotEmpty() @IsNumber() code: number
	@IsNotEmpty() password: string
}