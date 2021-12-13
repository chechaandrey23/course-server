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
exports.UserInfosService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const handler_error_1 = require("../../helpers/handler.error");
const userinfo_model_1 = require("./userinfo.model");
const theme_model_1 = require("../themes/theme.model");
const lang_model_1 = require("../langs/lang.model");
const user_model_1 = require("../users/user.model");
let UserInfosService = class UserInfosService {
    constructor(sequelize, userInfos, themes, langs, users) {
        this.sequelize = sequelize;
        this.userInfos = userInfos;
        this.themes = themes;
        this.langs = langs;
        this.users = users;
    }
    async createUserInfo(opts) {
        try {
            const transaction = opts.transaction;
            const userId = opts.userId;
            return await this.sequelize.transaction(Object.assign({}, (transaction ? { transaction } : {})), async (t) => {
                let entryLang = await this.langs.findOne({ attributes: ['id'], transaction: t, paranoid: false });
                if (!entryLang)
                    throw new common_1.ConflictException({ userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Lang"` });
                let entryTheme = await this.themes.findOne({ attributes: ['id'], transaction: t, paranoid: false });
                if (!entryTheme)
                    throw new common_1.ConflictException({ userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Theme"` });
                let entryUser = await this.users.findOne({ where: { id: userId }, transaction: t, paranoid: false });
                if (!entryUser)
                    throw new common_1.ConflictException({ userId, reason: `Unable to add "UserInfo" entry because user "${userId}" does not exist` });
                let res = await this.userInfos.create({ userId, langId: entryLang.getDataValue('id'), themeId: entryTheme.getDataValue('id') }, { transaction: t });
                return await this.userInfos.findOne({
                    include: [lang_model_1.Lang, theme_model_1.Theme, { model: user_model_1.User, attributes: ['id', 'user', 'social_id'] }],
                    where: { id: res.getDataValue('id') }, transaction: t
                });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async editUserInfo(opts) {
        try {
            const transaction = opts.transaction;
            return await this.sequelize.transaction(Object.assign({}, (transaction ? { transaction } : {})), async (t) => {
                if (!opts.superEdit) {
                    let res = await this.userInfos.findOne({ attributes: ['id'], where: { userId: opts.userId, id: opts.id }, transaction: t, paranoid: false });
                    if (!res)
                        throw new common_1.ConflictException(`EDIT: User "${opts.userId}" cannot edit content that is not the creator`);
                }
                await this.userInfos.update(Object.assign(Object.assign({}, (opts.superEdit ? { userId: opts.userId } : {})), { first_name: opts.first_name, last_name: opts.last_name, themeId: opts.themeId, langId: opts.langId }), { where: Object.assign({ id: opts.id }, (opts.superEdit ? {} : { userId: opts.userId })), transaction: t });
                return await this.userInfos.findOne({
                    include: [lang_model_1.Lang, theme_model_1.Theme, { model: user_model_1.User, attributes: ['id', 'user', 'social_id'] }],
                    where: { id: opts.id }, transaction: t
                });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async removeUserInfo(opts) {
        try {
            const transaction = opts.transaction;
            return await this.sequelize.transaction(Object.assign({}, (transaction ? { transaction } : {})), async (t) => {
                if (opts.superEdit) {
                    await this.userInfos.destroy({ where: { id: opts.id }, transaction: t });
                }
                else {
                    let res = await this.userInfos.findOne({ attributes: ['id'], where: { userId: opts.userId, id: opts.id }, transaction: t, paranoid: false });
                    if (!res)
                        throw new common_1.ConflictException(`REMOVE: User "${opts.userId}" cannot edit content that is not the creator`);
                    await this.userInfos.destroy({ where: { id: opts.id, userId: opts.userId }, transaction: t });
                }
                return { id: opts.id, deletedAt: (new Date()).toString() };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async restoreUserInfo(opts) {
        try {
            const transaction = opts.transaction;
            return await this.sequelize.transaction(Object.assign({}, (transaction ? { transaction } : {})), async (t) => {
                if (opts.superEdit) {
                    await this.userInfos.restore({ where: { id: opts.id }, transaction: t });
                }
                else {
                    let res = await this.userInfos.findOne({ attributes: ['id'], where: { userId: opts.userId, id: opts.id }, transaction: t, paranoid: false });
                    if (!res)
                        throw new common_1.ConflictException(`RESTORE: User "${opts.userId}" cannot edit content that is not the creator`);
                    await this.userInfos.restore({ where: { id: opts.id, userId: opts.userId }, transaction: t });
                }
                return { id: opts.id, deletedAt: null };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async deleteUserInfo(opts) {
        try {
            const transaction = opts.transaction;
            return await this.sequelize.transaction(Object.assign({}, (transaction ? { transaction } : {})), async (t) => {
                if (opts.superEdit) {
                    await this.userInfos.destroy({ where: { id: opts.id }, transaction: t, force: true });
                }
                else {
                    let res = await this.userInfos.findOne({ attributes: ['id'], where: { userId: opts.userId, id: opts.id }, transaction: t, paranoid: false });
                    if (!res)
                        throw new common_1.ConflictException(`DESTROY: User "${opts.userId}" cannot edit content that is not the creator`);
                    await this.userInfos.destroy({ where: { id: opts.id, userId: opts.userId }, transaction: t, force: true });
                }
                return { id: opts.id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id: opts.id });
        }
    }
    async getUserInfoAll(count, offset = 0, withDeleted = false) {
        return await this.userInfos.findAll({ include: [
                { model: lang_model_1.Lang, paranoid: !withDeleted },
                { model: theme_model_1.Theme, paranoid: !withDeleted },
                { model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted }
            ], offset: offset, limit: count, paranoid: !withDeleted
        });
    }
};
UserInfosService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(userinfo_model_1.UserInfo)),
    __param(2, (0, sequelize_1.InjectModel)(theme_model_1.Theme)),
    __param(3, (0, sequelize_1.InjectModel)(lang_model_1.Lang)),
    __param(4, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object, Object])
], UserInfosService);
exports.UserInfosService = UserInfosService;
//# sourceMappingURL=userinfos.service.js.map