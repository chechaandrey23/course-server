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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const handler_error_1 = require("../../helpers/handler.error");
const like_model_1 = require("./like.model");
const review_model_1 = require("../reviews/review.model");
const user_model_1 = require("../users/user.model");
const title_model_1 = require("../titles/title.model");
const group_model_1 = require("../groups/group.model");
const title_groups_model_1 = require("../titles/title.groups.model");
let LikesService = class LikesService {
    constructor(sequelize, likes) {
        this.sequelize = sequelize;
        this.likes = likes;
    }
    async createLike(reviewId, userId, like) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res0 = await this.likes.findOne({ where: { reviewId, userId }, transaction: t });
                if (res0)
                    throw new common_1.ConflictException({ reviewId, userId, reason: `User (userId: ${userId} / reviewId: ${reviewId}) can like only once` });
                let res = await this.likes.create({ reviewId, userId, like: !!like }, { transaction: t });
                return await this.likes.findOne({ include: [
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
    async editLike(id, reviewId, userId, like) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.likes.update({ like: !!like, reviewId, userId }, { where: { id }, transaction: t });
                return await this.likes.findOne({ include: [
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
    async removeLike(id) {
        try {
            await this.likes.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreLike(id) {
        try {
            await this.likes.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteLike(id) {
        try {
            await this.likes.destroy({ where: { id }, force: true });
            return { id: id };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getLikeAll(count, offset = 0, withDeleted = false) {
        return await this.likes.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted },
                { model: review_model_1.Review, attributes: ['id'], include: [{ model: title_groups_model_1.TitleGroups, paranoid: !withDeleted, include: [
                                { model: title_model_1.Title, attributes: ['id', 'title'], paranoid: !withDeleted },
                                { model: group_model_1.Group, attributes: ['id', 'group'], paranoid: !withDeleted }
                            ] }], paranoid: !withDeleted }], offset: offset, limit: count, paranoid: !withDeleted });
    }
};
LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(like_model_1.Like)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object])
], LikesService);
exports.LikesService = LikesService;
//# sourceMappingURL=likes.service.js.map