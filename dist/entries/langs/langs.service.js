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
exports.LangsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const handler_error_1 = require("../../helpers/handler.error");
const lang_model_1 = require("./lang.model");
let LangsService = class LangsService {
    constructor(sequelize, langs) {
        this.sequelize = sequelize;
        this.langs = langs;
    }
    async createLang(lang, title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.langs.findOne({ where: { lang }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ lang, title, reason: `Lang "${lang}(${title})" already exists` });
                return await this.langs.create({ lang, title, description }, { transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async editLang(id, lang, title, description) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.langs.findOne({ where: { [sequelize_2.Op.and]: [{ lang }, { id: { [sequelize_2.Op.ne]: id } }] }, transaction: t, paranoid: false });
                if (res)
                    throw new common_1.ConflictException({ id, lang, title, reason: `Unable to update lang "${lang}(${title})", such a lang already exists` });
                await this.langs.update({ lang, title, description }, { where: { id }, transaction: t });
                return await this.langs.findOne({ include: [], where: { id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async removeLang(id) {
        try {
            await this.langs.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async restoreLang(id) {
        try {
            await this.langs.restore({ where: { id } });
            return { id: id, deletedAt: null };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteLang(id) {
        try {
            await this.langs.destroy({ where: { id }, force: true });
            return { id: id };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getLangAll(count, offset = 0, withDeleted = false) {
        return await this.langs.findAll({ include: [], offset: offset, limit: count, paranoid: !withDeleted });
    }
    async getShortLangAll() {
        return await this.langs.findAll({ attributes: ['id', 'lang', 'title'] });
    }
};
LangsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(lang_model_1.Lang)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object])
], LangsService);
exports.LangsService = LangsService;
//# sourceMappingURL=langs.service.js.map