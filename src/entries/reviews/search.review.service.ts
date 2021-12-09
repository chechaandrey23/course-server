import {HttpException, HttpStatus, Injectable, ConflictException, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {ReviewsService, UpdateReview, CreateReview} from './reviews.service';

import {ReviewElasticSearchService, ReviewSearch} from '../reviewelasticsearch/review.elastic.search.service';

import {Review} from './review.model';

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

	public async getDualReviewIndex(reviewId: number, searchId: string) {
		return {
			review: await this.reviewsService.getReviewOne({reviewId, withCommentAll: true}),
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
				//let data: any = await this.reviewElasticSearch.deleteReviewWithId(searchId);
				let data: any = await this.reviewElasticSearch.deleteReview(reviewId);
				console.log(data);
				await this.reviews.update({searchId: null}, {where: {id: reviewId}, transaction: t});
				return {id: reviewId, searchId: null}
			});
		} catch(e) {
			handlerError(e, {id: reviewId});
		}
	}

	public async createReviewWithIndexing(opts: CreateReview) {
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

	public async updateReviewWithIndexing(opts: UpdateReview) {
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

	public async deleteReviewWithDeleteIndex(reviewId: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let data = await this.reviewsService.deleteReview(reviewId, t);
				let res = await this.reviewElasticSearch.deleteReview(reviewId);
				console.log(res);
				return {id: data.id};
			});
		} catch(e) {
			handlerError(e, {id: reviewId});
		}
	}
}
