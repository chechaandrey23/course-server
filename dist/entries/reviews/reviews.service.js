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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const review_model_1 = require("./review.model");
const review_tags_model_1 = require("./review.tags.model");
const user_model_1 = require("../users/user.model");
const title_model_1 = require("../titles/title.model");
const group_model_1 = require("../groups/group.model");
const title_groups_model_1 = require("../titles/title.groups.model");
const userinfo_model_1 = require("../userinfos/userinfo.model");
const tag_model_1 = require("../tags/tag.model");
const rating_model_1 = require("../ratings/rating.model");
const like_model_1 = require("../likes/like.model");
const comment_model_1 = require("../comments/comment.model");
const role_model_1 = require("../roles/role.model");
let ReviewsService = class ReviewsService {
    constructor(sequelize, reviews, reviewTags, titleGroups) {
        this.sequelize = sequelize;
        this.reviews = reviews;
        this.reviewTags = reviewTags;
        this.titleGroups = titleGroups;
    }
    async createReview(description, text, authorRating, userId, titleId, groupId, draft, tags, createWithOutGroupTitle = false) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let titleGroupId = 0;
                let res0 = await this.titleGroups.findOne({ where: { titleId, groupId }, transaction: t, paranoid: false });
                if (!res0) {
                    if (createWithOutGroupTitle) {
                        let res00 = await this.titleGroups.findOne({ transaction: t, paranoid: false });
                        if (!res00) {
                            throw new common_1.ConflictException({ reason: `Before supplements review it is necessary that at least one title exists` });
                        }
                        titleGroupId = res00.getDataValue('id');
                    }
                    else {
                        throw new common_1.ConflictException({ titleId, groupId, reason: `group/title "${groupId}/${titleId}" NOT FOUND` });
                    }
                }
                let res = await this.reviews.create({ description, text, authorRating, userId, titleGroupId: titleGroupId || res0.getDataValue('id'), draft: !!draft }, { transaction: t });
                await this._createReviewOther(t, tags, res.getDataValue('id'));
                return await this.reviews.findOne(this.buildQuery({ reviewId: res.getDataValue('id'), transaction: t }));
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async editReview(id, description, text, authorRating, userId, titleId, groupId, draft, tags) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res0 = await this.titleGroups.findOne({ where: { titleId, groupId }, transaction: t, paranoid: false });
                if (!res0)
                    throw new common_1.ConflictException({ titleId, groupId, reason: `group/title "${groupId}/${titleId}" NOT FOUND` });
                await this.reviews.update({ description, text, authorRating, userId, titleGroupId: res0.getDataValue('id'), draft: !!draft }, { where: { id }, transaction: t });
                await this._createReviewOther(t, tags, id);
                return await this.reviews.findOne(this.buildQuery({ reviewId: id, transaction: t }));
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async _createReviewOther(t, tags, reviewId) {
        await this.reviewTags.destroy({ where: { reviewId: reviewId, tagId: { [sequelize_2.Op.in]: tags } }, transaction: t });
        let newData = tags.map((entry) => {
            return {
                tagId: entry,
                reviewId
            };
        });
        await this.reviewTags.bulkCreate(newData, { transaction: t });
    }
    async removeReview(id) {
        try {
            await this.reviews.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteReview(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.reviewTags.destroy({ where: { reviewId: id }, transaction: t, force: true });
                await this.reviews.destroy({ where: { id }, transaction: t, force: true });
                return { id: id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getReviewAll(opts) {
        return await this.reviews.findAll(this.buildQueryAll(opts));
    }
    async getReviewOne(opts) {
        return await this.reviews.findOne(this.buildQueryOne(opts));
    }
    async getShortReviewAll() {
        return await this.reviews.findAll({ include: [{ model: title_groups_model_1.TitleGroups, include: [
                        { model: title_model_1.Title, attributes: ['id', 'title'] },
                        { model: group_model_1.Group, attributes: ['id', 'group'] }
                    ] }], attributes: ['id'], where: { draft: false } });
    }
    buildQuery(opts) {
        let ratingTableName = rating_model_1.Rating.tableName.toString();
        let reviewTableName = this.reviews.tableName.toString();
        let reviewModelName = this.reviews.name.toString();
        let comentTableName = comment_model_1.Comment.tableName.toString();
        let paranoid = !opts.withDeleted;
        let transaction = opts.transaction;
        let tagQueryObject = { model: tag_model_1.Tag, attributes: ['id', 'tag'], paranoid };
        let query = { attributes: {
                include: [
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT ROUND(AVG("userRating"), 1) FROM "${ratingTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "averageUserRating"],
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT ROUND(AVG("authorRating"), 1) FROM "${reviewTableName}" WHERE "titleGroupId"="${reviewModelName}"."titleGroupId")`), "averageEditorRating"],
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${comentTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "countComments"]
                ],
                exclude: [],
            }, include: [
                { model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid, include: [
                        { model: userinfo_model_1.UserInfo, attributes: ['first_name', 'last_name'], paranoid }
                    ] },
                { model: title_groups_model_1.TitleGroups, paranoid, include: [
                        { model: title_model_1.Title, attributes: ['id', 'title', 'description'], paranoid },
                        { model: group_model_1.Group, attributes: ['id', 'group'], paranoid }
                    ] },
                tagQueryObject,
            ], where: {}, subQuery: false, paranoid, transaction };
        let otherQuery = {};
        if (opts.limit !== undefined) {
            otherQuery.limit = opts.limit;
            otherQuery.offset = opts.offset;
        }
        if (!opts.full) {
            query.attributes.exclude.push('text');
        }
        if (opts.order === "AR")
            otherQuery.order = [[sequelize_typescript_1.Sequelize.col('averageEditorRating'), 'DESC NULLS LAST']];
        if (opts.order === "UR")
            otherQuery.order = [[sequelize_typescript_1.Sequelize.col('averageUserRating'), 'DESC NULLS LAST']];
        if (opts.order === "CA")
            otherQuery.order = [[sequelize_typescript_1.Sequelize.col('createdAt'), 'DESC NULLS LAST']];
        if (opts.reviewId)
            query.where = Object.assign(Object.assign({}, query.where), { id: opts.reviewId });
        if (opts.release)
            query.where = Object.assign(Object.assign({}, query.where), { draft: false });
        if (opts.forUserId)
            query.where = Object.assign(Object.assign({}, query.where), { userId: opts.forUserId });
        return Object.assign(Object.assign({}, query), otherQuery);
    }
    buildQueryAll(opts) {
        let ratingTableName = rating_model_1.Rating.tableName.toString();
        let reviewTableName = this.reviews.tableName.toString();
        let reviewModelName = this.reviews.name.toString();
        let comentTableName = comment_model_1.Comment.tableName.toString();
        let paranoid = !opts.withDeleted;
        let transaction = opts.transaction;
        const includeTags = { model: tag_model_1.Tag, attributes: ['id', 'tag'], paranoid };
        const includeTitleGroups = { model: title_groups_model_1.TitleGroups, paranoid, where: {}, include: [
                { model: title_model_1.Title, attributes: ['id', 'title', 'description'], paranoid },
                { model: group_model_1.Group, attributes: ['id', 'group'], paranoid }
            ] };
        const includeUsers = { model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid, include: [
                { model: userinfo_model_1.UserInfo, attributes: ['first_name', 'last_name'], paranoid }
            ] };
        let query = { attributes: {
                include: [
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT ROUND(AVG("userRating"), 1) FROM "${ratingTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "averageUserRating"],
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT ROUND(AVG("authorRating"), 1) FROM "${reviewTableName}" WHERE "titleGroupId"="${reviewModelName}"."titleGroupId")`), "averageEditorRating"],
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${comentTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "countComments"]
                ],
                exclude: ['text'],
            }, include: [
                includeUsers,
                includeTitleGroups,
                includeTags,
            ], where: {}, subQuery: false, paranoid, transaction };
        let otherQuery = {};
        if (opts.limit !== undefined) {
            otherQuery.limit = opts.limit;
            otherQuery.offset = opts.offset;
        }
        if (opts.forUserId) {
            query.include.push({ model: rating_model_1.Rating, required: false, paranoid, attributes: ['id', 'userRating'], where: {
                    userId: opts.forUserId, reviewId: [sequelize_typescript_1.Sequelize.col(`"${reviewModelName}"."id"`)]
                } });
            query.include.push({ model: like_model_1.Like, required: false, paranoid, attributes: ['id', 'like'], where: {
                    userId: opts.forUserId, reviewId: [sequelize_typescript_1.Sequelize.col(`"${reviewModelName}"."id"`)]
                } });
        }
        if (opts.condUserId)
            query.where = Object.assign(Object.assign({}, query.where), { userId: opts.condUserId });
        if (opts.condPublic !== undefined)
            query.where = Object.assign(Object.assign({}, query.where), { draft: !opts.condPublic });
        if (opts.withTags)
            includeTags.where = { id: opts.withTags };
        if (opts.withTitles)
            includeTitleGroups.where = Object.assign(Object.assign({}, includeTitleGroups.where), { titleId: opts.withTitles });
        if (opts.withGroups)
            includeTitleGroups.where = Object.assign(Object.assign({}, includeTitleGroups.where), { groupId: opts.withGroups });
        if (opts.withAuthors) {
            includeUsers.where = { id: opts.withAuthors };
            includeUsers.include.push({ model: role_model_1.Role, through: { where: { selected: true } }, where: { role: getRoleEditorUser() }, paranoid });
        }
        if (opts.sortField) {
            otherQuery.order = [[sequelize_typescript_1.Sequelize.col(opts.sortField), (opts.sortType === 'DESC' ? 'DESC' : 'ASC') + ' NULLS LAST']];
        }
        return Object.assign(Object.assign({}, query), otherQuery);
    }
    buildQueryOne(opts) {
        let ratingTableName = rating_model_1.Rating.tableName.toString();
        let reviewTableName = this.reviews.tableName.toString();
        let reviewModelName = this.reviews.name.toString();
        let comentTableName = comment_model_1.Comment.tableName.toString();
        let paranoid = !opts.withDeleted;
        let transaction = opts.transaction;
        const includeTags = { model: tag_model_1.Tag, attributes: ['id', 'tag'], paranoid };
        const includeTitleGroups = { model: title_groups_model_1.TitleGroups, paranoid, where: {}, include: [
                { model: title_model_1.Title, attributes: ['id', 'title', 'description'], paranoid },
                { model: group_model_1.Group, attributes: ['id', 'group'], paranoid }
            ] };
        const includeUsers = { model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid, include: [
                { model: userinfo_model_1.UserInfo, attributes: ['first_name', 'last_name'], paranoid }
            ] };
        let query = { attributes: {
                include: [
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT ROUND(AVG("userRating"), 1) FROM "${ratingTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "averageUserRating"],
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT ROUND(AVG("authorRating"), 1) FROM "${reviewTableName}" WHERE "titleGroupId"="${reviewModelName}"."titleGroupId")`), "averageEditorRating"],
                ],
                exclude: [],
            }, include: [
                includeUsers,
                includeTitleGroups,
                includeTags,
            ], where: { id: opts.reviewId }, subQuery: false, paranoid, transaction };
        let otherQuery = {};
        if (opts.forUserId) {
            query.include.push({ model: rating_model_1.Rating, required: false, paranoid, attributes: ['id', 'userRating'], where: {
                    userId: opts.forUserId, reviewId: [sequelize_typescript_1.Sequelize.col(`"${reviewModelName}"."id"`)]
                } });
            query.include.push({ model: like_model_1.Like, required: false, paranoid, attributes: ['id', 'like'], where: {
                    userId: opts.forUserId, reviewId: [sequelize_typescript_1.Sequelize.col(`"${reviewModelName}"."id"`)]
                } });
        }
        if (opts.condUserId)
            query.where = Object.assign(Object.assign({}, query.where), { userId: opts.condUserId });
        if (opts.condPublic !== undefined)
            query.where = Object.assign(Object.assign({}, query.where), { draft: !opts.condPublic });
        return Object.assign(Object.assign({}, query), otherQuery);
    }
    async getReviewTagAll(count, offset = 0) {
        return await this.reviewTags.findAll({ include: [], offset: offset, limit: count });
    }
};
ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(review_model_1.Review)),
    __param(2, (0, sequelize_1.InjectModel)(review_tags_model_1.ReviewTags)),
    __param(3, (0, sequelize_1.InjectModel)(title_groups_model_1.TitleGroups)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object])
], ReviewsService);
exports.ReviewsService = ReviewsService;
function getRoleEditorUser() { return 2; }
//# sourceMappingURL=reviews.service.js.map