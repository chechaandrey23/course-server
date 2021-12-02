import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {LikesService} from './likes.service';

import {Like} from './like.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Like])
	],
	controllers: [],
	providers: [
		LikesService
	],
	exports: [
		LikesService
	]
})
export class LikesModule {}
