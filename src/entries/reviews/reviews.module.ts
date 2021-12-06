import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ReviewsService} from './reviews.service';

import {Review} from './review.model';
import {ReviewTags} from './review.tags.model';
import {Tag} from '../tags/tag.model';
import {TitleGroups} from '../titles/title.groups.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Review, ReviewTags, TitleGroups, Tag])
	],
	controllers: [],
	providers: [
		ReviewsService
	],
	exports: [
		ReviewsService,
	]
})
export class ReviewsModule {}
