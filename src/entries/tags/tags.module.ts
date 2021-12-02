import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {TagsService} from './tags.service';

import {Tag} from './tag.model';
//import {Review} from '../reviews/review.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Tag]),
	],
	controllers: [],
	providers: [
		TagsService
	],
	exports: [
		TagsService
	]
})
export class TagsModule {}
