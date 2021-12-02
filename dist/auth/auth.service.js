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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../config");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    getCookieWithJwtAccess(id, roles) {
        const payload = { id, roles };
        const token = this.jwtService.sign(payload, {
            secret: config_1.JWT_SECRET_ACCESS,
            expiresIn: config_1.JWT_ACCESS_EXPIRATION_TIME
        });
        return {
            token,
            cookie: `Access=${token}; HttpOnly; Path=/; Max-Age=${Math.round(config_1.JWT_ACCESS_EXPIRATION_TIME / 1000)}`
        };
    }
    getCookieWithJwtRefresh(id, roles) {
        const payload = { id, roles };
        const token = this.jwtService.sign(payload, {
            secret: config_1.JWT_SECRET_REFRESH,
            expiresIn: config_1.JWT_REFRESH_EXPIRATION_TIME
        });
        return {
            token,
            cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=${Math.round(config_1.JWT_REFRESH_EXPIRATION_TIME / 1000)}`
        };
    }
    getCookiesForLogOut() {
        return [
            'Access=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
            'Roles=; Path=/; Max-Age=0'
        ];
    }
    getCookieRoles(roles) {
        return `Roles=${JSON.stringify(roles)}; Path=/;`;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map