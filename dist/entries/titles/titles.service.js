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
exports.TitlesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const title_model_1 = require("./title.model");
const title_groups_model_1 = require("./title.groups.model");
const group_model_1 = require("../groups/group.model");
let TitlesService = class TitlesService {
    constructor(sequelize, titles, groups, titleGroups) {
        this.sequelize = sequelize;
        this.titles = titles;
        this.groups = groups;
        this.titleGroups = titleGroups;
    }
    async createTitle(title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.titles.findOne({ where: { title }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ title, reason: `Title "${title}" already exists` });
                let res1 = await this.titles.create({ title, description }, { transaction: t });
                await this._patchTitleGroups(t, res1.id);
                return res1;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async _patchTitleGroups(t, titleId) {
        let res2 = await this.groups.findAll({ attributes: ['id'], transaction: t, paranoid: false });
        let newData = res2.map((entry) => { return { groupId: entry.getDataValue('id'), titleId }; });
        let res3 = await this.titleGroups.bulkCreate(newData, { transaction: t });
    }
    async editTitle(id, title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.titles.findOne({ where: { [sequelize_2.Op.and]: [{ title }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ id, title, reason: `Unable to update title name "${title}", such a title already exists` });
                await this.titles.update({ title, description }, { where: { id }, transaction: t });
                return await this.titles.findOne({ include: [], where: { id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeTitle(id) {
        try {
            await this.titles.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreTitle(id) {
        try {
            await this.titles.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteTitle(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.titleGroups.destroy({ where: { titleId: id }, transaction: t, force: true });
                await this.titles.destroy({ where: { id }, transaction: t, force: true });
                return { id: id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getTitleAll(count, offset = 0, withDeleted = false) {
        return await this.titles.findAll({ include: [], offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getShortTitleAll(count, offset = 0) {
        return await this.titles.findAll({ attributes: ['id', 'title'], offset: offset, limit: count });
    }
    async getPartTitleAll(count, offset = 0, query) {
        return await this.titles.findAll({ attributes: ['id', 'title'], offset: offset, limit: count, where: { title: {
                    [sequelize_2.Op.substring]: query
                } } });
    }
    async getTitleGroupAll(count, offset = 0) {
        return await this.titleGroups.findAll({ include: [title_model_1.Title, group_model_1.Group], offset: offset, limit: count });
    }
};
TitlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(title_model_1.Title)),
    __param(2, (0, sequelize_1.InjectModel)(group_model_1.Group)),
    __param(3, (0, sequelize_1.InjectModel)(title_groups_model_1.TitleGroups)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object])
], TitlesService);
exports.TitlesService = TitlesService;
//# sourceMappingURL=titles.service.js.map