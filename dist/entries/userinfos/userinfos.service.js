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
    async createUserInfo(userId) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
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
    async editUserInfo(id, first_name, last_name, themeId, langId) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.userInfos.update({ first_name, last_name, themeId, langId }, { where: { id }, transaction: t });
                return await this.userInfos.findOne({
                    include: [lang_model_1.Lang, theme_model_1.Theme, { model: user_model_1.User, attributes: ['id', 'user', 'social_id'] }],
                    where: { id }, transaction: t
                });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeUserInfo(id) {
        try {
            await this.userInfos.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteUserInfo(id) {
        try {
            await this.userInfos.destroy({ where: { id }, force: true });
            return { id: id };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
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