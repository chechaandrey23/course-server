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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const tag_model_1 = require("./tag.model");
const review_model_1 = require("../reviews/review.model");
const review_tags_model_1 = require("../reviews/review.tags.model");
let TagsService = class TagsService {
    constructor(sequelize, tags, reviews, reviewTags) {
        this.sequelize = sequelize;
        this.tags = tags;
        this.reviews = reviews;
        this.reviewTags = reviewTags;
    }
    async createTag(tag) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.tags.findOne({ where: { tag }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ tag, reason: `Tag "${tag}" already exists` });
                let res1 = await this.tags.create({ tag }, { transaction: t });
                await this._patchReviewTag(t, res1.id);
                return await this.tags.findOne(this.buildQuery({ userId: res1.getDataValue('id'), transaction: t }));
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async _patchReviewTag(t, tagId) {
        let res2 = await this.reviews.findAll({ attributes: ['id'], transaction: t, paranoid: false });
        let newData = res2.map((entry) => { return { reviewId: entry.getDataValue('id'), tagId, selected: false }; });
        let res3 = await this.reviewTags.bulkCreate(newData, { transaction: t });
    }
    async editTag(id, tag) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.tags.update({ tag }, { where: { id }, transaction: t });
                return await this.tags.findOne(this.buildQuery({ userId: id, transaction: t }));
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeTag(id) {
        try {
            await this.tags.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreTag(id) {
        try {
            await this.tags.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteTag(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.reviewTags.destroy({ where: { tagId: id }, transaction: t, force: true });
                await this.tags.destroy({ where: { id }, force: true });
                return { id: id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getTagAll(opts) {
        return await this.tags.findAll(this.buildQuery(opts));
    }
    buildQuery(opts) {
        let paranoid = !opts.withDeleted;
        let transaction = opts.transaction;
        let query = { raw: true, includeIgnoreAttributes: false, subQuery: false, paranoid,
            attributes: { include: [[sequelize_typescript_1.Sequelize.fn('COUNT', sequelize_typescript_1.Sequelize.col('reviews.id')), 'countReview']], },
            include: [{ model: review_model_1.Review, required: false, attributes: [], through: { where: { selected: true } }, paranoid },],
            where: {}, group: ['Tag.id'], transaction
        };
        let otherQuery = {};
        if (opts.limit !== undefined) {
            otherQuery.limit = opts.limit;
            otherQuery.offset = opts.offset;
        }
        if (opts.userId) {
            query.where = Object.assign(Object.assign({}, query.where), { id: opts.userId });
        }
        if (opts.order)
            otherQuery.order = [[sequelize_typescript_1.Sequelize.col('countReview'), 'DESC NULLS LAST']];
        return Object.assign(Object.assign({}, query), otherQuery);
    }
    async getPartTagAll(count, offset = 0, query) {
        return await this.tags.findAll({ attributes: ['id', 'tag'], offset: offset, limit: count, where: { tag: {
                    [sequelize_2.Op.substring]: query
                } } });
    }
    async getShortTagAll() {
        return await this.tags.findAll({});
    }
};
TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(tag_model_1.Tag)),
    __param(2, (0, sequelize_1.InjectModel)(review_model_1.Review)),
    __param(3, (0, sequelize_1.InjectModel)(review_tags_model_1.ReviewTags)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object])
], TagsService);
exports.TagsService = TagsService;
//# sourceMappingURL=tags.service.js.map