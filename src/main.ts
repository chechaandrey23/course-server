import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';

import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const httpAdapter = app.getHttpAdapter();

	httpAdapter.use('/admin', express.static(path.resolve()+'/../admin/dist/admin'));
	httpAdapter.use('/', express.static(path.resolve()+'/../client/build'));

	httpAdapter.use(cookieParser());

	app.useGlobalPipes(new ValidationPipe());

	await app.listen(process.env.PORT || 3039);
}
bootstrap();
