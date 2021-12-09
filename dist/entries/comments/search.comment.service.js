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
exports.SearchCommentService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const handler_error_1 = require("../../helpers/handler.error");
const comments_service_1 = require("./comments.service");
const review_elastic_search_service_1 = require("../reviewelasticsearch/review.elastic.search.service");
const review_model_1 = require("../reviews/review.model");
const comment_model_1 = require("./comment.model");
let SearchCommentService = class SearchCommentService {
    constructor(sequelize, commentsService, reviews, comments, reviewElasticSearch) {
        this.sequelize = sequelize;
        this.commentsService = commentsService;
        this.reviews = reviews;
        this.comments = comments;
        this.reviewElasticSearch = reviewElasticSearch;
    }
    async createCommentWithIndexing(opts) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let comment = await this.commentsService.createComment(Object.assign(Object.assign({}, opts), { transaction: t }));
                comment = comment.toJSON();
                let review = await this.reviews.findOne({ attributes: ['id', 'searchId'], where: { id: opts.reviewId }, transaction: t });
                if (!review || !review.searchId)
                    throw new common_1.ConflictException(`Review "${review === null || review === void 0 ? void 0 : review.id}" could not be updated in the index because searchID does not exist`);
                const res = await this.reviewElasticSearch.addReviewCommentWithId(review.searchId, comment.id, comment.comment);
                console.log(res);
                return comment;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async updateCommentWithIndexing(opts) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let comment = await this.commentsService.editComment(Object.assign(Object.assign({}, opts), { transaction: t }));
                comment = comment.toJSON();
                let review = await this.reviews.findOne({ attributes: ['id', 'searchId'], where: { id: opts.reviewId }, transaction: t });
                if (!review || !review.searchId)
                    throw new common_1.ConflictException(`Review "${review === null || review === void 0 ? void 0 : review.id}" could not be updated in the index because searchID does not exist`);
                const res = await this.reviewElasticSearch.updateReviewCommentWithId(review.searchId, comment.id, comment.comment);
                console.log(res);
                return comment;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async deleteCommentWithIndexing(commentId) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let comment = await this.comments.findOne({ attributes: ['id', 'reviewId'], where: { id: commentId }, transaction: t });
                if (!comment)
                    throw new common_1.ConflictException(`Comment "${commentId}" IS NOT DEFINED`);
                let data = await this.commentsService.deleteComment(commentId, t);
                let review = await this.reviews.findOne({ attributes: ['id', 'searchId'], where: { id: comment.reviewId }, transaction: t });
                if (!review || !review.searchId)
                    throw new common_1.ConflictException(`Review "${review === null || review === void 0 ? void 0 : review.id}" could not be updated in the index because searchID does not exist`);
                const res = await this.reviewElasticSearch.deleteReviewCommentWithId(review.searchId, commentId);
                console.log(res);
                return data;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: commentId });
        }
    }
};
SearchCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, sequelize_1.InjectModel)(review_model_1.Review)),
    __param(3, (0, sequelize_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        comments_service_1.CommentsService, Object, Object, review_elastic_search_service_1.ReviewElasticSearchService])
], SearchCommentService);
exports.SearchCommentService = SearchCommentService;
//# sourceMappingURL=search.comment.service.js.map