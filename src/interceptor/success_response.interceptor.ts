import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Response } from 'src/api_response.interface'

@Injectable()
export class SuccessInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private status: number = HttpStatus.OK) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'success',
        status: this.status,
        data,
      })),
    )
  }
}
