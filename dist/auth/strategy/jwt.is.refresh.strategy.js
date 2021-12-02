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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtIsRefreshStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const refresh_token_service_1 = require("../../entries/refreshtoken/refresh.token.service");
const config_1 = require("../../config");
let JwtIsRefreshStrategy = class JwtIsRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-is-refresh') {
    constructor(refreshTokenService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([(request) => {
                    var _a;
                    return (_a = request === null || request === void 0 ? void 0 : request.cookies) === null || _a === void 0 ? void 0 : _a.Refresh;
                }]),
            ignoreExpiration: false,
            secretOrKey: config_1.JWT_SECRET_REFRESH,
            passReqToCallback: true
        });
        this.refreshTokenService = refreshTokenService;
    }
    async validate(request, payload) {
        return await this.refreshTokenService.checkRefreshToken(payload.id, request.cookies.Refresh) ? { id: payload.id, roles: payload.roles } : null;
    }
};
JwtIsRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [refresh_token_service_1.RefreshTokenService])
], JwtIsRefreshStrategy);
exports.JwtIsRefreshStrategy = JwtIsRefreshStrategy;
//# sourceMappingURL=jwt.is.refresh.strategy.js.map