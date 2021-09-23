import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP CUSTOME LOGS');


	use(req: Request, res: Response, next: NextFunction): void {
		const { ip, method, originalUrl, hostname } = req;
		const userAgent = req.get('user-agent') || '';

		this.logger.log(`\n\n${hostname}\t${method}\t${originalUrl} - ${userAgent}\t${ip}`);

		res.on('finish', () => {
			const { statusCode } = res;
			const contentLength = res.get('content-length');

			if (statusCode > 299)
				return this.logger.error(`\nstatus\t${statusCode}\terror\tcontent-length\t${contentLength}`);
			else
				return this.logger.log(`\nstatus\t${statusCode}\tcontent-length\t${contentLength}`);
		});

		next();
	};
}