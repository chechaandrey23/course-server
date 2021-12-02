import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {CommentsService} from './comments.service';

import {Comment} from './comment.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Comment])
	],
	controllers: [],
	providers: [
		CommentsService
	],
	exports: [
		CommentsService
	]
})
export class CommentsModule {}
