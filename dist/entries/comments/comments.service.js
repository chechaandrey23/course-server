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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const comment_model_1 = require("./comment.model");
const review_model_1 = require("../reviews/review.model");
const user_model_1 = require("../users/user.model");
const title_model_1 = require("../titles/title.model");
const group_model_1 = require("../groups/group.model");
const title_groups_model_1 = require("../titles/title.groups.model");
let CommentsService = class CommentsService {
    constructor(sequelize, comments) {
        this.sequelize = sequelize;
        this.comments = comments;
    }
    async createComment(reviewId, userId, comment, draft, blocked) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.comments.create({ reviewId, userId, comment, draft: !!draft, blocked: !!blocked }, { transaction: t });
                return await this.comments.findOne({ include: [
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
    async editComment(id, reviewId, userId, comment, draft, blocked) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.comments.update({ comment, draft: !!draft, blocked: !!blocked, reviewId, userId }, { where: { id }, transaction: t });
                console.log(res);
                return await this.comments.findOne({ include: [
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
    async removeComment(id) {
        try {
            await this.comments.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreComment(id) {
        try {
            await this.comments.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteComment(id) {
        try {
            await this.comments.destroy({ where: { id }, force: true });
            return { id: id };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getCommentAll(count, offset = 0, withDeleted = false) {
        return await this.comments.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted },
                { model: review_model_1.Review, attributes: ['id'], include: [{ model: title_groups_model_1.TitleGroups, paranoid: !withDeleted, include: [
                                { model: title_model_1.Title, attributes: ['id', 'title'], paranoid: !withDeleted },
                                { model: group_model_1.Group, attributes: ['id', 'group'], paranoid: !withDeleted }
                            ] }], paranoid: !withDeleted }], offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getCommentReviewAll(count, offset = 0, reviewId, isPublic = true, blocked = false, withDeleted = false) {
        return await this.comments.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted },
                { model: review_model_1.Review, attributes: ['id'], include: [{ model: title_groups_model_1.TitleGroups, paranoid: !withDeleted, include: [
                                { model: title_model_1.Title, attributes: ['id', 'title'], paranoid: !withDeleted },
                                { model: group_model_1.Group, attributes: ['id', 'group'], paranoid: !withDeleted }
                            ] }], paranoid: !withDeleted }], where: { reviewId, draft: !isPublic, blocked }, offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getAutoUpdateCommentAll(time, reviewId, isPublic = true, blocked = false, withDeleted = false) {
        const currentDate = Date.now();
        if (currentDate - time >= 30 * 1000)
            throw new common_1.ConflictException('The parameter for auto-update of comments cannot exceed 30 seconds');
        return await this.comments.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted },
                { model: review_model_1.Review, attributes: ['id'], include: [{ model: title_groups_model_1.TitleGroups, paranoid: !withDeleted, include: [
                                { model: title_model_1.Title, attributes: ['id', 'title'], paranoid: !withDeleted },
                                { model: group_model_1.Group, attributes: ['id', 'group'], paranoid: !withDeleted }
                            ] }], paranoid: !withDeleted }], where: { reviewId, draft: !isPublic, blocked, createdAt: { [sequelize_2.Op.gte]: time } }, paranoid: !withDeleted });
    }
};
CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object])
], CommentsService);
exports.CommentsService = CommentsService;
//# sourceMappingURL=comments.service.js.map