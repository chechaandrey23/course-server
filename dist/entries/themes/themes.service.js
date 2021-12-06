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
exports.ThemesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const theme_model_1 = require("./theme.model");
let ThemesService = class ThemesService {
    constructor(sequelize, themes) {
        this.sequelize = sequelize;
        this.themes = themes;
    }
    async createTheme(theme, title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.themes.findOne({ where: { theme }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ theme, title, reason: `Theme "${theme}(${title})" already exists` });
                return await this.themes.create({ theme, title, description }, { transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async editTheme(id, theme, title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.themes.findOne({ where: { [sequelize_2.Op.and]: [{ theme }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ id, theme, title, reason: `Unable to update theme "${theme}(${title})", such a theme already exists` });
                await this.themes.update({ theme, title, description }, { where: { id }, transaction: t });
                return await this.themes.findOne({ include: [], where: { id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeTheme(id) {
        try {
            await this.themes.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreTheme(id) {
        try {
            await this.themes.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteTheme(id) {
        try {
            await this.themes.destroy({ where: { id }, force: true });
            return { id: id };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getThemeAll(count, offset = 0, withDeleted = false) {
        return await this.themes.findAll({ include: [], offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getShortThemeAll() {
        return await this.themes.findAll({ attributes: ['id', 'theme', 'title'] });
    }
};
ThemesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(theme_model_1.Theme)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object])
], ThemesService);
exports.ThemesService = ThemesService;
//# sourceMappingURL=themes.service.js.map