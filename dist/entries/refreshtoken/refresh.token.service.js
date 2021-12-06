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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const bcrypt = require("bcryptjs");
const handler_error_1 = require("../../helpers/handler.error");
const refresh_token_model_1 = require("./refresh.token.model");
const user_model_1 = require("../users/user.model");
const config_1 = require("../../config");
let RefreshTokenService = class RefreshTokenService {
    constructor(sequelize, refreshToken) {
        this.sequelize = sequelize;
        this.refreshToken = refreshToken;
    }
    async hashedToken(token) {
        return await bcrypt.hash(config_1.REFRESH_TOKEN_SALT_SECRET_1 + token + config_1.REFRESH_TOKEN_SALT_SECRET_2, config_1.REFRESH_TOKEN_SALT_ROUNDS);
    }
    async compareToken(hash, clientToken) {
        return await bcrypt.compare(config_1.REFRESH_TOKEN_SALT_SECRET_1 + clientToken + config_1.REFRESH_TOKEN_SALT_SECRET_2, hash);
    }
    async addRefreshToken(userId, refreshToken, timeLive) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.refreshToken.findOne({ where: { userId }, transaction: t });
                if (!res) {
                    await this.refreshToken.create({ userId, RT1: await this.hashedToken(refreshToken), dateEndRT1: Date.now() + timeLive }, { transaction: t });
                }
                else {
                    await this.refreshToken.update({ RT1: await this.hashedToken(refreshToken), dateEndRT1: Date.now() + timeLive }, { where: { userId }, transaction: t });
                }
                return true;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async checkRefreshToken(userId, refreshToken) {
        try {
            let res = await this.refreshToken.findOne({ where: { userId } });
            if (!res)
                return false;
            return await this.compareToken(res.RT1, refreshToken);
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async replaceRefreshToken(userId, refreshToken, newRefreshToken, timeLive) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.refreshToken.findOne({ where: { userId }, transaction: t });
                if (!res)
                    throw new common_1.NotAcceptableException(`Unable to update refresh token for user id "${userId}"`);
                if (!res.RT1 || !await this.compareToken(res.RT1, refreshToken))
                    throw new common_1.NotAcceptableException(`Invalid refresh token provided`);
                await this.refreshToken.update({ RT1: await this.hashedToken(newRefreshToken), dateEndRT1: Date.now() + timeLive }, { where: { userId }, transaction: t });
                return true;
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async deleteRefreshTokenAll(userId) {
        try {
            this.refreshToken.update({ RT1: null, dateEndRT1: null }, { where: { userId } });
            return true;
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async refreshTokenGetAll(count, offset = 0, withDeleted = false) {
        return this.refreshToken.findAll({ attributes: { exclude: ['RT1'] }, include: [
                { model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted }
            ], offset: offset, limit: count, paranoid: !withDeleted });
    }
    async refreshTokenDelete(id) {
        try {
            await this.refreshToken.destroy({ where: { id }, force: true });
            return { id: id };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
};
RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(refresh_token_model_1.RefreshToken)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object])
], RefreshTokenService);
exports.RefreshTokenService = RefreshTokenService;
//# sourceMappingURL=refresh.token.service.js.map