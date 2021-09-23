import { Todo } from '.prisma/client';

export class TodoEntity implements Todo {
	id: string;
	name: string;
	description: string;
	completed: boolean;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}
