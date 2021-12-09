import {HttpException, HttpStatus, Injectable, ConflictException, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {CommentsService, CreateComment, UpdateComment} from './comments.service';

import {ReviewElasticSearchService, ReviewSearch} from '../reviewelasticsearch/review.elastic.search.service';

import {Review} from '../reviews/review.model';
import {Comment} from './comment.model';

@Injectable()
export class SearchCommentService {
	constructor(
		private sequelize: Sequelize,
		private commentsService: CommentsService,
		@InjectModel(Review) private reviews: typeof Review,
		@InjectModel(Comment) private comments: typeof Comment,
		private reviewElasticSearch: ReviewElasticSearchService
	) {}

	public async createCommentWithIndexing(opts: CreateComment) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment: any = await this.commentsService.createComment({...opts, ...{transaction: t}});
				comment = comment.toJSON();
				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: opts.reviewId}, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				const res: any = await this.reviewElasticSearch.addReviewCommentWithId(review.searchId, comment.id, comment.comment);
				console.log(res);
				return comment;
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async updateCommentWithIndexing(opts: UpdateComment) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment: any = await this.commentsService.editComment({...opts, ...{transaction: t}});
				comment = comment.toJSON();
				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: opts.reviewId}, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				const res: any = await this.reviewElasticSearch.updateReviewCommentWithId(review.searchId, comment.id, comment.comment);
				console.log(res);
				return comment;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteCommentWithIndexing(commentId: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment = await this.comments.findOne({attributes: ['id', 'reviewId'], where: {id: commentId}, transaction: t});

				if(!comment) throw new ConflictException(`Comment "${commentId}" IS NOT DEFINED`);

				let data = await this.commentsService.deleteComment(commentId, t);

				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: comment.reviewId}, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				const res: any = await this.reviewElasticSearch.deleteReviewCommentWithId(review.searchId, commentId);
				console.log(res);

				return data;
			});
		} catch(e) {
			handlerError(e, {id: commentId});
		}
	}

}
