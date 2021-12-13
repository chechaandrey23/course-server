import {HttpException, HttpStatus, Injectable, ConflictException, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {ReviewsService, UpdateReview, CreateReview, DeleteReview, RemoveReview, RestoreReview} from './reviews.service';

import {ReviewElasticSearchService, ReviewSearch} from '../reviewelasticsearch/review.elastic.search.service';

import {Review} from './review.model';

export interface SearchDeleteReview extends DeleteReview {}
export interface SearchRemoveReview extends RemoveReview {}
export interface SearchRestoreReview extends RestoreReview {}
export interface SearchCreateReview extends CreateReview {}
export interface SearchUpdateReview extends UpdateReview {}

@Injectable()
export class SearchReviewService {
	constructor(
		private sequelize: Sequelize,
		private reviewsService: ReviewsService,
		@InjectModel(Review) private reviews: typeof Review,
		private reviewElasticSearch: ReviewElasticSearchService
	) {}

	public async getReviewForSearchAll(opts: any) {
		return await this.reviewsService.getReviewAll(opts || {});
	}

	public async getSearchAll(query: string, opts: any) {
		 let data: any = await this.reviewElasticSearch.searchReviews(query, opts.offset || 0, opts.limit || 0);
		 return await this.reviewsService.getReviewAll({...opts, ...{getByIds: data.ids}});
	}

	public async getDualReviewIndex(reviewId: number, searchId: string, withDeleted: boolean = false) {
		return {
			review: await this.reviewsService.getReviewOne({
				reviewId, withCommentAll: true, withDeleted, condCommentsPublic: true, condCommentsBlocked: false, condCommentsWithDeleted: false
			}),
			index: searchId?await this.reviewElasticSearch.getReviewIndexWithIndex(searchId):null
		}
	}

	public async createIndex(reviewId: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let review: any = await this.reviewsService.getReviewOne({reviewId, withCommentAll: true, transaction: t});
				let data: any = await this.reviewElasticSearch.indexReview(review as ReviewSearch);
				console.log(data);
				await this.reviews.update({searchId: data.body._id}, {where: {id: reviewId}, transaction: t});
				return {id: reviewId, searchId: data.body._id}
			});
		} catch(e) {
			handlerError(e, {id: reviewId});
		}
	}

	public async deleteIndex(reviewId: number, searchId: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let data: any = await this.reviewElasticSearch.deleteReview(reviewId);
				console.log(data);
				await this.reviews.update({searchId: null}, {where: {id: reviewId}, transaction: t});
				return {id: reviewId, searchId: null}
			});
		} catch(e) {
			handlerError(e, {id: reviewId});
		}
	}

	public async createReviewWithIndexing(opts: SearchCreateReview) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let review: any = await this.reviewsService.createReview({...opts, ...{transaction: t}});
				review = review.toJSON();
				const res: any = await this.reviewElasticSearch.indexReview(review as ReviewSearch);
				console.log(res);
				await this.reviews.update({searchId: res.body._id}, {where: {id: review.id}, transaction: t});
				return review;
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async updateReviewWithIndexing(opts: SearchUpdateReview) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let review: any = await this.reviewsService.editReview({...opts, ...{transaction: t}});
				review = review.toJSON();
				if(!review.searchId) throw new ConflictException(`Review "${review.id}" could not be updated in the index because searchID does not exist`);
				const res = await this.reviewElasticSearch.updateReview(review as ReviewSearch);
				console.log(res);
				return review;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteReviewWithDeleteIndex(opts: SearchDeleteReview) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let data = await this.reviewsService.deleteReview({...opts, ...{transaction: t}});
				let res = await this.reviewElasticSearch.deleteReview(opts.id);
				console.log(res);
				return data;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async removeReviewWithDeleteIndex(opts: SearchRemoveReview) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let data = await this.reviewsService.removeReview({...opts, ...{transaction: t}});
				let res = await this.reviewElasticSearch.removeReview(opts.id);
				console.log(res);
				return data;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreReviewWithDeleteIndex(opts: SearchRestoreReview) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let data = await this.reviewsService.restoreReview({...opts, ...{transaction: t}});
				let res = await this.reviewElasticSearch.restoreReview(opts.id);
				console.log(res);
				return data;
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

}
