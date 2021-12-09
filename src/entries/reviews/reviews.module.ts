import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ReviewElasticSearchModule} from '../reviewelasticsearch/review.elastic.search.module';

import {ReviewsService} from './reviews.service';
import {SearchReviewService} from './search.review.service';

import {Review} from './review.model';
import {ReviewTags} from './review.tags.model';
import {Tag} from '../tags/tag.model';
import {TitleGroups} from '../titles/title.groups.model';
import {Comment} from '../comments/comment.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Review, ReviewTags, TitleGroups, Tag]),
		ReviewElasticSearchModule
	],
	controllers: [],
	providers: [
		ReviewsService,
		SearchReviewService
	],
	exports: [
		ReviewsService,
		SearchReviewService
	]
})
export class ReviewsModule {}
