import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {TagsService} from './tags.service';

import {Tag} from './tag.model';
import {Review} from '../reviews/review.model';
import {ReviewTags} from '../reviews/review.tags.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Tag, Review, ReviewTags]),
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
