import { Auth } from ".prisma/client";
import { UserEntity } from "./user.entity";

export class AuthEntity implements Auth {
	id: string;
	code: number;
	token_type: string;
	access_token: string;
	refresh_token: string;
	expired_in: number;
	user: UserEntity;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}