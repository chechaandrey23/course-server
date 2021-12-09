import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ReviewElasticSearchModule} from '../reviewelasticsearch/review.elastic.search.module';

import {CommentsService} from './comments.service';
import {SearchCommentService} from './search.comment.service';

import {Comment} from './comment.model';
import {Review} from '../reviews/review.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Comment, Review]),
		ReviewElasticSearchModule
	],
	controllers: [],
	providers: [
		CommentsService,
		SearchCommentService
	],
	exports: [
		CommentsService,
		SearchCommentService
	]
})
export class CommentsModule {}
