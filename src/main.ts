import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ErrorsInterceptor } from './interceptor/error_response.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// global prefix
	app.setGlobalPrefix('api')

	// global validator pipe
	app.useGlobalPipes(new ValidationPipe());

	// global interceptor for response type
	app.useGlobalInterceptors(new ErrorsInterceptor())

	// spin up server
	await app.listen(parseInt(process.env.PORT));
}

// check PORT in .env file
if (isNaN(parseInt(process.env.PORT))) {
	console.log("PORT is required, check your .env file.");
	process.exit(2);
}

bootstrap()
