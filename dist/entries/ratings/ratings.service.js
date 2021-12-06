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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const handler_error_1 = require("../../helpers/handler.error");
const rating_model_1 = require("./rating.model");
const review_model_1 = require("../reviews/review.model");
const user_model_1 = require("../users/user.model");
const title_model_1 = require("../titles/title.model");
const group_model_1 = require("../groups/group.model");
const title_groups_model_1 = require("../titles/title.groups.model");
let RatingsService = class RatingsService {
    constructor(sequelize, ratings) {
        this.sequelize = sequelize;
        this.ratings = ratings;
    }
    async createRating(reviewId, userId, rating) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res0 = await this.ratings.findOne({ where: { reviewId, userId }, transaction: t });
                if (res0)
                    throw new common_1.ConflictException({ reviewId, userId, reason: `User (userId: ${userId} / reviewId: ${reviewId}) can vote only once` });
                let res = await this.ratings.create({ reviewId, userId, userRating: rating }, { transaction: t });
                return await this.ratings.findOne({ include: [
                        { model: user_model_1.User, attributes: ['id', 'user', 'social_id'] },
                        { model: review_model_1.Review, attributes: ['id'], include: [{ model: title_groups_model_1.TitleGroups, include: [
                                        { model: title_model_1.Title, attributes: ['id', 'title'] },
                                        { model: group_model_1.Group, attributes: ['id', 'group'] }
                                    ] }] }
                    ], where: { id: res.getDataValue('id'), reviewId, userId }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async editRating(id, reviewId, userId, rating) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.ratings.update({ userRating: rating, reviewId, userId }, { where: { id }, transaction: t });
                return await this.ratings.findOne({ include: [
                        { model: user_model_1.User, attributes: ['id', 'user', 'social_id'] },
                        { model: review_model_1.Review, attributes: ['id'], include: [{ model: title_groups_model_1.TitleGroups, include: [
                                        { model: title_model_1.Title, attributes: ['id', 'title'] },
                                        { model: group_model_1.Group, attributes: ['id', 'group'] }
                                    ] }] }
                    ], where: { id, reviewId, userId }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeRating(id) {
        try {
            await this.ratings.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreRating(id) {
        try {
            await this.ratings.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteRating(id) {
        try {
            await this.ratings.destroy({ where: { id }, force: true });
            return { id: id };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getRatingAll(count, offset = 0, withDeleted = false) {
        return await this.ratings.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted },
                { model: review_model_1.Review, attributes: ['id'], include: [{ model: title_groups_model_1.TitleGroups, paranoid: !withDeleted, include: [
                                { model: title_model_1.Title, attributes: ['id', 'title'], paranoid: !withDeleted },
                                { model: group_model_1.Group, attributes: ['id', 'group'], paranoid: !withDeleted }
                            ] }], paranoid: !withDeleted }], offset: offset, limit: count, paranoid: !withDeleted });
    }
};
RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(rating_model_1.Rating)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object])
], RatingsService);
exports.RatingsService = RatingsService;
//# sourceMappingURL=ratings.service.js.map