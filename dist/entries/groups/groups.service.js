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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const group_model_1 = require("./group.model");
const title_groups_model_1 = require("../titles/title.groups.model");
const title_model_1 = require("../titles/title.model");
let GroupsService = class GroupsService {
    constructor(sequelize, groups, titles, titleGroups) {
        this.sequelize = sequelize;
        this.groups = groups;
        this.titles = titles;
        this.titleGroups = titleGroups;
    }
    async createGroup(group, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.groups.findOne({ where: { group }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ group, reason: `Group "${group}" already exists` });
                let res1 = await this.groups.create({ group, description }, { transaction: t });
                await this._patchTitleGroups(t, res1.id);
                return res1;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async _patchTitleGroups(t, groupId) {
        let res2 = await this.titles.findAll({ attributes: ['id'], transaction: t, paranoid: false });
        let newData = res2.map((entry) => { return { titleId: entry.getDataValue('id'), groupId }; });
        let res3 = await this.titleGroups.bulkCreate(newData, { transaction: t });
    }
    async editGroup(id, group, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.groups.findOne({ where: { [sequelize_2.Op.and]: [{ group }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ id, group, reason: `Unable to update group name "${group}", such a group already exists` });
                await this.groups.update({ group, description }, { where: { id }, transaction: t });
                return await this.groups.findOne({ include: [], where: { id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeGroup(id) {
        try {
            await this.groups.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteGroup(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.titleGroups.destroy({ where: { groupId: id }, transaction: t, force: true });
                await this.groups.destroy({ where: { id }, transaction: t, force: true });
                return { id: id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getGroupAll(count, offset = 0, withDeleted = false) {
        return await this.groups.findAll({ include: [], offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getShortGroupAll() {
        return await this.groups.findAll({ attributes: ['id', 'group'] });
    }
};
GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(group_model_1.Group)),
    __param(2, (0, sequelize_1.InjectModel)(title_model_1.Title)),
    __param(3, (0, sequelize_1.InjectModel)(title_groups_model_1.TitleGroups)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object])
], GroupsService);
exports.GroupsService = GroupsService;
//# sourceMappingURL=groups.service.js.map