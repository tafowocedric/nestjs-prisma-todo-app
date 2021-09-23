import { Prisma } from '.prisma/client'
import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	HttpStatus,
	Injectable,
	MethodNotAllowedException,
	NestInterceptor,
	NotFoundException,
} from '@nestjs/common'
import { catchError, Observable } from 'rxjs'
import { Response } from 'src/api_response.interface'

export class EntityNotFoundError extends Error { };

export class EntityAlreadyExist extends Error { };

export class EntityUnauthorized extends Error { };

export class EntityMethodNotAllowed extends Error { };

@Injectable()
export class ErrorsInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		return next.handle().pipe(
			catchError(error => {
				let data = {
					success: false,
					message: typeof error === 'object' && error?.message,
					data: [],
				};

				if (error instanceof EntityNotFoundError) {
					data['status'] = HttpStatus.NOT_FOUND;
					throw new NotFoundException(data);
				}

				else if (error instanceof EntityAlreadyExist) {
					data['status'] = HttpStatus.CONFLICT;
					throw new NotFoundException(data);
				}

				else if (error instanceof EntityUnauthorized) {
					data['status'] = HttpStatus.UNAUTHORIZED;
					throw new BadRequestException(data)
				}
					
				else if (error instanceof EntityMethodNotAllowed) {
					data['status'] = HttpStatus.METHOD_NOT_ALLOWED;
					throw new MethodNotAllowedException(data)
				}

				// prisma exception filter
				else if (error instanceof Prisma.PrismaClientKnownRequestError) {
					data = new PrismaClientExceptionFilter(error, data)
						.get_error_response();
					throw new NotFoundException(data);
				}

				else {
					data['status'] = error.status;
					data['message'] = error.response.message;
					throw new NotFoundException(data)
				}
			}),
		)
	}
}

class PrismaClientExceptionFilter {
	constructor(
		private error: Prisma.PrismaClientKnownRequestError,
		private data: any,
	) { }

	get_error_response() {
		switch (this.error.code) {
			case 'P2002':
				this.data['message'] = 'Record already exist'
				this.data['status'] = HttpStatus.CONFLICT
				break

			default:
				break
		}

		return this.data
	}
}
