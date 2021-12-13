import {HttpException, HttpStatus, Injectable, ConflictException, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {CommentsService, CreateComment, UpdateComment, RemoveComment, DeleteComment, RestoreComment} from './comments.service';

import {ReviewElasticSearchService, ReviewSearch} from '../reviewelasticsearch/review.elastic.search.service';

import {Review} from '../reviews/review.model';
import {Comment} from './comment.model';

export interface SearchDeleteComment extends DeleteComment {}
export interface SearchRemoveComment extends RemoveComment {}
export interface SearchRestoreComment extends RestoreComment {}
export interface SearchCreateComment extends CreateComment {}
export interface SearchUpdateComment extends UpdateComment {}

@Injectable()
export class SearchCommentService {
	constructor(
		private sequelize: Sequelize,
		private commentsService: CommentsService,
		@InjectModel(Review) private reviews: typeof Review,
		@InjectModel(Comment) private comments: typeof Comment,
		private reviewElasticSearch: ReviewElasticSearchService
	) {}

	public async createCommentWithIndexing(opts: SearchCreateComment) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment: any = await this.commentsService.createComment({...opts, ...{transaction: t}});
				comment = comment.toJSON();
				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: opts.reviewId}, paranoid: false, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				const res: any = await this.reviewElasticSearch.addReviewCommentWithId(review.searchId, comment.id, comment.comment);
				console.log(res);
				return comment;
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async updateCommentWithIndexing(opts: SearchUpdateComment) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment: any = await this.commentsService.editComment({...opts, ...{transaction: t}});
				comment = comment.toJSON();
				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: opts.reviewId}, paranoid: false, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				let res: any;
				if(!!comment.blocked || !!comment.draft || !!comment.deletedAt) {
					res = await this.reviewElasticSearch.deleteReviewCommentWithId(review.searchId, opts.id);
				} else {
					res = await this.reviewElasticSearch.updateReviewCommentWithId(review.searchId, comment.id, comment.comment);
				}
				console.log(res);

				return comment;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteCommentWithIndexing(opts: SearchDeleteComment) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment = await this.comments.findOne({attributes: ['id', 'reviewId'], where: {id: opts.id}, transaction: t});

				if(!comment) throw new ConflictException(`Comment "${opts.id}" IS NOT DEFINED`);

				let data = await this.commentsService.deleteComment({...opts, ...{transaction: t}});

				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: comment.reviewId}, paranoid: false, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				const res: any = await this.reviewElasticSearch.deleteReviewCommentWithId(review.searchId, opts.id);
				console.log(res);

				return data;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async removeCommentWithIndexing(opts: SearchRemoveComment) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment = await this.comments.findOne({attributes: ['id', 'reviewId'], where: {id: opts.id}, paranoid: false, transaction: t});

				if(!comment) throw new ConflictException(`Comment "${opts.id}" IS NOT DEFINED`);

				let data = await this.commentsService.removeComment({...opts, ...{transaction: t}});

				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: comment.reviewId}, paranoid: false, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				const res: any = await this.reviewElasticSearch.deleteReviewCommentWithId(review.searchId, opts.id);
				console.log(res);

				return data;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreCommentWithIndexing(opts: SearchRestoreComment) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let comment = await this.comments.findOne({attributes: ['id', 'reviewId', 'comment', 'blocked', 'draft'], paranoid: false, where: {id: opts.id}, transaction: t});

				if(!comment) throw new ConflictException(`Comment "${opts.id}" IS NOT DEFINED`);

				let data = await this.commentsService.restoreComment({...opts, ...{transaction: t}});

				let review = await this.reviews.findOne({attributes: ['id', 'searchId'], where: {id: comment.reviewId}, paranoid: false, transaction: t});

				if(!review || !review.searchId) throw new ConflictException(`Review "${review?.id}" could not be updated in the index because searchID does not exist`);

				if(!comment.blocked && !comment.draft) {
					const res: any = await this.reviewElasticSearch.updateReviewCommentWithId(review.searchId, comment.id, comment.comment);
					console.log(res);
				} else {
					console.log('COMMENT CANNOT BEEN UPDATED(COMMENT IS BLOCKED OR DRAFTED)');
				}

				return data;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

}
