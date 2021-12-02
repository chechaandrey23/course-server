import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ImagesService} from './images.service';

import {Image} from './image.model';
import {User} from '../users/user.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Image, User]),
	],
	controllers: [],
	providers: [
		ImagesService
	],
	exports: [
		ImagesService
	]
})
export class ImagesModule {}
