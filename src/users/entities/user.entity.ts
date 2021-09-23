import { User } from ".prisma/client";

export class UserEntity implements User {
	id: string;
	username: string;
	email: string;
	phone: string;
	password: string;
	is_verified: boolean;
	createdAt: Date;
	updatedAt: Date;

}
