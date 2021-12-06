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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const role_model_1 = require("./role.model");
const user_roles_model_1 = require("../users/user.roles.model");
const user_model_1 = require("../users/user.model");
let RolesService = class RolesService {
    constructor(sequelize, roles, users, userRoles) {
        this.sequelize = sequelize;
        this.roles = roles;
        this.users = users;
        this.userRoles = userRoles;
    }
    async createRole(role, title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.roles.findOne({ where: { role }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ role, title, reason: `Role "${role}(${title})" already exists` });
                let res1 = await this.roles.create({ role, title, description }, { transaction: t });
                await this._patchUserRoles(t, res1.id);
                return res1;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async _patchUserRoles(t, roleId) {
        let res2 = await this.users.findAll({ attributes: ['id'], transaction: t, paranoid: false });
        let newData = res2.map((entry) => { return { userId: entry.getDataValue('id'), roleId }; });
        let res3 = await this.userRoles.bulkCreate(newData, { transaction: t });
    }
    async editRole(id, role, title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.roles.findOne({ where: { [sequelize_2.Op.and]: [{ role }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ id, role, reason: `Unable to update role uid "${role}(${title})", such a role already exists` });
                await this.roles.update({ role, title, description }, { where: { id }, transaction: t });
                return await this.roles.findOne({ include: [], where: { id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeRole(id) {
        try {
            await this.roles.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreRole(id) {
        try {
            await this.roles.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteRole(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.userRoles.destroy({ where: { roleId: id }, transaction: t, force: true });
                await this.roles.destroy({ where: { id }, transaction: t, force: true });
                return { id: id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getRoleAll(count, offset = 0, withDeleted = false) {
        return await this.roles.findAll({ include: [], offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getShortRoleAll() {
        return await this.roles.findAll({ attributes: ['id', 'role', 'title'] });
    }
};
RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(role_model_1.Role)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __param(3, (0, sequelize_1.InjectModel)(user_roles_model_1.UserRoles)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object])
], RolesService);
exports.RolesService = RolesService;
//# sourceMappingURL=roles.service.js.map