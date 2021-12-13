"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchReviewService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const handler_error_1 = require("../../helpers/handler.error");
const reviews_service_1 = require("./reviews.service");
const review_elastic_search_service_1 = require("../reviewelasticsearch/review.elastic.search.service");
const review_model_1 = require("./review.model");
let SearchReviewService = class SearchReviewService {
    constructor(sequelize, reviewsService, reviews, reviewElasticSearch) {
        this.sequelize = sequelize;
        this.reviewsService = reviewsService;
        this.reviews = reviews;
        this.reviewElasticSearch = reviewElasticSearch;
    }
    async getReviewForSearchAll(opts) {
        return await this.reviewsService.getReviewAll(opts || {});
    }
    async getSearchAll(query, opts) {
        let data = await this.reviewElasticSearch.searchReviews(query, opts.offset || 0, opts.limit || 0);
        return await this.reviewsService.getReviewAll(Object.assign(Object.assign({}, opts), { getByIds: data.ids }));
    }
    async getDualReviewIndex(reviewId, searchId, withDeleted = false) {
        return {
            review: await this.reviewsService.getReviewOne({
                reviewId, withCommentAll: true, withDeleted, condCommentsPublic: true, condCommentsBlocked: false, condCommentsWithDeleted: false
            }),
            index: searchId ? await this.reviewElasticSearch.getReviewIndexWithIndex(searchId) : null
        };
    }
    async createIndex(reviewId) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let review = await this.reviewsService.getReviewOne({ reviewId, withCommentAll: true, transaction: t });
                let data = await this.reviewElasticSearch.indexReview(review);
                console.log(data);
                await this.reviews.update({ searchId: data.body._id }, { where: { id: reviewId }, transaction: t });
                return { id: reviewId, searchId: data.body._id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: reviewId });
        }
    }
    async deleteIndex(reviewId, searchId) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let data = await this.reviewElasticSearch.deleteReview(reviewId);
                console.log(data);
                await this.reviews.update({ searchId: null }, { where: { id: reviewId }, transaction: t });
                return { id: reviewId, searchId: null };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: reviewId });
        }
    }
    async createReviewWithIndexing(opts) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let review = await this.reviewsService.createReview(Object.assign(Object.assign({}, opts), { transaction: t }));
                review = review.toJSON();
                const res = await this.reviewElasticSearch.indexReview(review);
                console.log(res);
                await this.reviews.update({ searchId: res.body._id }, { where: { id: review.id }, transaction: t });
                return review;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async updateReviewWithIndexing(opts) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let review = await this.reviewsService.editReview(Object.assign(Object.assign({}, opts), { transaction: t }));
                review = review.toJSON();
                if (!review.searchId)
                    throw new common_1.ConflictException(`Review "${review.id}" could not be updated in the index because searchID does not exist`);
                const res = await this.reviewElasticSearch.updateReview(review);
                console.log(res);
                return review;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async deleteReviewWithDeleteIndex(opts) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let data = await this.reviewsService.deleteReview(Object.assign(Object.assign({}, opts), { transaction: t }));
                let res = await this.reviewElasticSearch.deleteReview(opts.id);
                console.log(res);
                return data;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async removeReviewWithDeleteIndex(opts) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let data = await this.reviewsService.removeReview(Object.assign(Object.assign({}, opts), { transaction: t }));
                let res = await this.reviewElasticSearch.removeReview(opts.id);
                console.log(res);
                return data;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async restoreReviewWithDeleteIndex(opts) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let data = await this.reviewsService.restoreReview(Object.assign(Object.assign({}, opts), { transaction: t }));
                let res = await this.reviewElasticSearch.restoreReview(opts.id);
                console.log(res);
                return data;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
};
SearchReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, sequelize_1.InjectModel)(review_model_1.Review)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        reviews_service_1.ReviewsService, Object, review_elastic_search_service_1.ReviewElasticSearchService])
], SearchReviewService);
exports.SearchReviewService = SearchReviewService;
//# sourceMappingURL=search.review.service.js.map