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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const bcrypt = require("bcryptjs");
const config_1 = require("../../config");
const handler_error_1 = require("../../helpers/handler.error");
const user_model_1 = require("./user.model");
const user_roles_model_1 = require("./user.roles.model");
const role_model_1 = require("../roles/role.model");
const userinfo_model_1 = require("../userinfos/userinfo.model");
const theme_model_1 = require("../themes/theme.model");
const lang_model_1 = require("../langs/lang.model");
const like_model_1 = require("../likes/like.model");
const refresh_token_model_1 = require("../refreshtoken/refresh.token.model");
let UsersService = class UsersService {
    constructor(sequelize, roles, users, userInfos, themes, langs, userRoles, refreshToken) {
        this.sequelize = sequelize;
        this.roles = roles;
        this.users = users;
        this.userInfos = userInfos;
        this.themes = themes;
        this.langs = langs;
        this.userRoles = userRoles;
        this.refreshToken = refreshToken;
    }
    async hashedPassword(password) {
        return await bcrypt.hash(config_1.PASSWORD_SALT_SECRET_1 + password + config_1.PASSWORD_SALT_SECRET_2, config_1.PASSWORD_SALT_ROUNDS);
    }
    async comparePassword(hash, clientPassword) {
        return await bcrypt.compare(config_1.PASSWORD_SALT_SECRET_1 + clientPassword + config_1.PASSWORD_SALT_SECRET_2, hash);
    }
    isSelectedRoleNewUser(role) {
        if (role === 0) {
            return true;
        }
        else if (role === 1) {
            return true;
        }
        else {
            return false;
        }
    }
    getRoleEditorUser() { return 2; }
    getRoleUserUser() { return 1; }
    async createUser(user, password, email, first_name = '', last_name = '') {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res0 = await this.users.findOne({ where: { email }, transaction: t, paranoid: false });
                if (res0)
                    throw new common_1.ConflictException({ email, reason: `User with email "${email}" already exists` });
                let res = await this.users.findOne({ where: { user }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ user, reason: `User "${user}" already exists` });
                let res1 = await this.users.create({ user, email, password: await this.hashedPassword(password) }, { transaction: t });
                await this._createUserOther(t, res1.id, [first_name, last_name]);
                const _user = await this.users.findOne({ include: [{ model: role_model_1.Role, through: { where: { selected: true } } }], attributes: { include: [
                            [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${like_model_1.Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
                        ], exclude: ['password'] }, where: { id: res1.id }, transaction: t });
                return _user;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async createSocialUser(social_id, vendor, softCreate = false, displayName = '') {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                social_id = `${social_id}(${vendor})`;
                let res = await this.users.findOne({ where: { social_id }, transaction: t, paranoid: false });
                if (res) {
                    if (res.blocked)
                        throw new common_1.NotAcceptableException(`User with social id "${social_id}" - is BANNED`);
                    if (!!softCreate) {
                        const _user = await this.users.findOne({ include: [{ model: role_model_1.Role, through: { where: { selected: true } } }], attributes: { include: [
                                    [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${like_model_1.Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
                                ], exclude: ['password'] }, where: { id: res.getDataValue('id') }, transaction: t });
                        if (!_user)
                            throw new common_1.ConflictException({ social_id, reason: `User with social id "${social_id}" is in the process of being removed and cannot be used` });
                        return _user;
                    }
                    else {
                        throw new common_1.ConflictException({ social_id, reason: `User with social id "${social_id}" already exists` });
                    }
                }
                let res1 = await this.users.create({ social_id }, { transaction: t });
                const [first_name = '', last_name = ''] = displayName.split(/\s+/, 2);
                await this._createUserOther(t, res1.id, [first_name, last_name]);
                return await this.users.findOne({ include: [{ model: role_model_1.Role, through: { where: { selected: true } } }], attributes: { include: [
                            [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${like_model_1.Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
                        ], exclude: ['password'] }, where: { id: res1.id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async _createUserOther(t, userId, displayName) {
        let res2 = await this.roles.findAll({ attributes: ['id', 'role'], transaction: t, paranoid: false });
        let newData = res2.map((entry) => {
            return {
                roleId: entry.getDataValue('id'),
                userId: userId,
                selected: this.isSelectedRoleNewUser(entry.getDataValue('role'))
            };
        });
        let res3 = await this.userRoles.bulkCreate(newData, { transaction: t });
        let entryLang = await this.langs.findOne({ attributes: ['id'], transaction: t, paranoid: false });
        if (!entryLang)
            throw new common_1.ConflictException({ userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Lang"` });
        let entryTheme = await this.themes.findOne({ attributes: ['id'], transaction: t, paranoid: false });
        if (!entryTheme)
            throw new common_1.ConflictException({ userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Theme"` });
        let res = await this.userInfos.create({
            userId, langId: entryLang.getDataValue('id'), themeId: entryTheme.getDataValue('id'), first_name: displayName[0], last_name: displayName[1]
        }, { transaction: t });
    }
    async editUserAdmin(id, user, social_id, email, blocked, activated, roles) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let newData = {};
                if (user && user.length > 0) {
                    let res = await this.users.findOne({ where: { [sequelize_2.Op.and]: [{ user }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                    if (res)
                        throw new common_1.ConflictException({ id, user, reason: `Unable to update user name "${user}", such a user already exists` });
                    newData['user'] = user;
                }
                if (social_id && social_id.length > 0) {
                    let res = await this.users.findOne({ where: { [sequelize_2.Op.and]: [{ social_id }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                    if (res)
                        throw new common_1.ConflictException({ id, social_id, reason: `Unable to update social_id "${social_id}", such a social_id already exists` });
                    newData['social_id'] = social_id;
                }
                if (email && email.length > 0) {
                    let res = await this.users.findOne({ where: { [sequelize_2.Op.and]: [{ email }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                    if (res)
                        throw new common_1.ConflictException({ id, email, reason: `Unable to update email "${email}", such a email already exists` });
                    newData['email'] = email;
                    newData['activated'] = false;
                }
                const changedRoles = await this.changedRoles(t, roles, id);
                if (changedRoles) {
                    await this.userRoles.update({ selected: false }, { where: { userId: id }, transaction: t });
                    await this.userRoles.update({ selected: true }, { where: { userId: id, roleId: { [sequelize_2.Op.in]: roles } }, transaction: t });
                }
                if (blocked || changedRoles) {
                    await this.refreshToken.update({ RT1: null, dateEndRT1: null }, { where: { userId: id } });
                }
                let res1 = await this.users.update(Object.assign(Object.assign({}, newData), { blocked: !!blocked, activated }), { where: { id }, transaction: t });
                return await this.users.findOne({ include: [{ model: role_model_1.Role, through: { where: { selected: true } } }], attributes: { include: [
                            [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${like_model_1.Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
                        ], exclude: ['password'] }, where: { id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async changedRoles(t, roles, userId) {
        let res = await this.userRoles.findAll({ transaction: t, where: { userId: userId, selected: true } });
        return !(roles.length === res.length && res.every((item) => !!~roles.indexOf(item.getDataValue('roleId'))));
    }
    async changePassword(id, prevPassword, newPassword) { }
    async removeUser(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.userInfos.destroy({ where: { userId: id }, transaction: t });
                await this.users.destroy({ where: { id } });
                return { id: id, deletedAt: (new Date()).toString() };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreUser(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.userInfos.restore({ where: { userId: id }, transaction: t });
                await this.users.restore({ where: { id } });
                return { id: id, deletedAt: null };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteUser(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.refreshToken.destroy({ where: { userId: id }, transaction: t, force: true });
                await this.userInfos.destroy({ where: { userId: id }, transaction: t, force: true });
                await this.userRoles.destroy({ where: { userId: id }, transaction: t, force: true });
                await this.users.destroy({ where: { id }, transaction: t, force: true });
                return { id: id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async checkUser(username, password) {
        let res = await this.users.findOne({ include: [{ model: role_model_1.Role, through: { where: { selected: true } } }], where: { user: username } });
        if (!res)
            throw new common_1.NotAcceptableException(`User "${username}" NOT FOUND`);
        if (res.blocked)
            throw new common_1.NotAcceptableException(`User "${username}" - is BANNED`);
        if (!await this.comparePassword(res.password, password))
            throw new common_1.NotAcceptableException(`Password is INCORRECT`);
        let data = res.toJSON();
        delete data.password;
        return data;
    }
    async checkUserId(id) {
        let res = await this.users.findOne({ include: [{ model: role_model_1.Role, through: { where: { selected: true } } }], where: { id } });
        if (!res)
            throw new common_1.NotAcceptableException(`User (with ID) "${id}" NOT FOUND`);
        if (res.blocked)
            throw new common_1.NotAcceptableException(`User (with ID) "${id}" - is BANNED`);
        let data = res.toJSON();
        delete data.password;
        return data;
    }
    async getUserAll(count, offset = 0, withDeleted = false) {
        return await this.users.findAll({ include: [{ model: role_model_1.Role, through: { where: { selected: true } }, paranoid: !withDeleted }], attributes: {
                include: [
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${like_model_1.Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
                ],
                exclude: ['password']
            }, offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getUserOne(id) {
        return await this.users.findOne({ include: [
                { model: userinfo_model_1.UserInfo, include: [{ model: lang_model_1.Lang }, { model: theme_model_1.Theme }] },
                { model: role_model_1.Role, through: { where: { selected: true } } }
            ], attributes: { include: [
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(*) FROM "${like_model_1.Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
                ], exclude: ['password'] }, where: { id: id } });
    }
    async getShortUserAll(count, offset = 0) {
        return await this.users.findAll({ include: [{ model: userinfo_model_1.UserInfo, attributes: ['first_name', 'last_name'] }], attributes: ['id', 'user', 'social_id'], offset: offset, limit: count });
    }
    async getShortEditorUserAll(count, offset = 0) {
        return await this.users.findAll({ include: [{ model: userinfo_model_1.UserInfo, attributes: ['first_name', 'last_name'] }, { model: role_model_1.Role, through: { where: { selected: true } }, where: { role: this.getRoleEditorUser() }, paranoid: false }], attributes: ['id', 'user', 'social_id'], offset: offset, limit: count });
    }
    async getShortUserUserAll(count, offset = 0) {
        return await this.users.findAll({ include: [{ model: userinfo_model_1.UserInfo, attributes: ['first_name', 'last_name'] }, { model: role_model_1.Role, through: { where: { selected: true } }, where: { role: this.getRoleUserUser() }, paranoid: false }], attributes: ['id', 'user', 'social_id'], offset: offset, limit: count });
    }
    async getUserRoleAll(count, offset = 0) {
        return await this.userRoles.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'] }, role_model_1.Role], offset: offset, limit: count });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(role_model_1.Role)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(3, (0, sequelize_1.InjectModel)(userinfo_model_1.UserInfo)),
    __param(4, (0, sequelize_1.InjectModel)(theme_model_1.Theme)),
    __param(5, (0, sequelize_1.InjectModel)(lang_model_1.Lang)),
    __param(6, (0, sequelize_1.InjectModel)(user_roles_model_1.UserRoles)),
    __param(7, (0, sequelize_1.InjectModel)(refresh_token_model_1.RefreshToken)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object, Object, Object, Object, Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map