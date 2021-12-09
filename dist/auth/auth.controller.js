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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const refresh_token_service_1 = require("../entries/refreshtoken/refresh.token.service");
const users_service_1 = require("../entries/users/users.service");
const auth_service_1 = require("./auth.service");
const config_1 = require("../config");
const jwt_refresh_auth_guard_1 = require("./guards/jwt.refresh.auth.guard");
const local_auth_guard_1 = require("./guards/local.auth.guard");
const github_auth_guard_1 = require("./guards/github.auth.guard");
const facebook_auth_guard_1 = require("./guards/facebook.auth.guard");
const google_auth_guard_1 = require("./guards/google.auth.guard");
let AuthController = class AuthController {
    constructor(refreshTokenService, authService, usersService) {
        this.refreshTokenService = refreshTokenService;
        this.authService = authService;
        this.usersService = usersService;
    }
    async logIn(req) {
        const user = req.user;
        const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
        const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);
        await this.refreshTokenService.addRefreshToken(user.id, refresh.token, config_1.JWT_REFRESH_EXPIRATION_TIME);
        req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);
        return { id: user.id, roles: user.roles, accessToken: access.token };
    }
    async socialAuth() { }
    async logOut(req) {
        const user = req.user;
        const cookies = this.authService.getCookiesForLogOut();
        if (user && user.id)
            await this.refreshTokenService.deleteRefreshTokenAll(user.id);
        req.res.setHeader('Set-Cookie', cookies);
        return { id: user === null || user === void 0 ? void 0 : user.id, roles: user === null || user === void 0 ? void 0 : user.roles };
    }
    async registration(req, username, password, password2, email, first_name, last_name) {
        if (password !== password2)
            throw new common_1.ConflictException(`Password and repeated password must be the same`);
        let res = await this.usersService.createUser(username, password, email, first_name, last_name);
        res = res.toJSON();
        let user = { id: res.id, roles: res.roles.map((entry) => { return entry.role; }) };
        const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
        const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);
        await this.refreshTokenService.addRefreshToken(user.id, refresh.token, config_1.JWT_REFRESH_EXPIRATION_TIME);
        req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);
        return { id: user.id, roles: user.roles, accessToken: access.token };
    }
    async refresh(req) {
        var _a;
        const user = req.user;
        const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
        const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);
        try {
            await this.refreshTokenService.replaceRefreshToken(user.id, (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.Refresh, refresh.token, config_1.JWT_REFRESH_EXPIRATION_TIME);
        }
        catch (e) {
            if (e instanceof common_1.NotAcceptableException) {
                req.res.setHeader('Set-Cookie', [
                    'Access=; HttpOnly; Path=/; Max-Age=0',
                    'Refresh=; HttpOnly; Path=/; Max-Age=0',
                    'Roles=; Path=/; Max-Age=0'
                ]);
            }
            throw e;
        }
        req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);
        return { id: user.id, roles: user.roles, accessToken: access.token };
    }
    async authGitHub(req) { }
    async authGitHubCallback(req) {
        const user = req.user;
        const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
        const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);
        await this.refreshTokenService.addRefreshToken(user.id, refresh.token, config_1.JWT_REFRESH_EXPIRATION_TIME);
        req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);
        return { id: user.id, roles: user.roles, accessToken: access.token };
    }
    async authFaceBook(req) { }
    async authFaceBookCallback(req) {
        const user = req.user;
        const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
        const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);
        await this.refreshTokenService.addRefreshToken(user.id, refresh.token, config_1.JWT_REFRESH_EXPIRATION_TIME);
        req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);
        return { id: user.id, roles: user.roles, accessToken: access.token };
    }
    async authGoogle(req) { }
    async authGoogleCallback(req) {
        const user = req.user;
        const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
        const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);
        await this.refreshTokenService.addRefreshToken(user.id, refresh.token, config_1.JWT_REFRESH_EXPIRATION_TIME);
        req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);
        return { id: user.id, roles: user.roles, accessToken: access.token };
    }
};
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logIn", null);
__decorate([
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logOut", null);
__decorate([
    (0, common_1.Post)('/registration'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('username')),
    __param(2, (0, common_1.Body)('password')),
    __param(3, (0, common_1.Body)('password2')),
    __param(4, (0, common_1.Body)('email')),
    __param(5, (0, common_1.Body)('first_name')),
    __param(6, (0, common_1.Body)('last_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registration", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_auth_guard_1.JWTRefreshAuthGuard),
    (0, common_1.Post)('/refresh'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(github_auth_guard_1.GitHubAuthGuard),
    (0, common_1.Get)('/github'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authGitHub", null);
__decorate([
    (0, common_1.Redirect)('/user', 302),
    (0, common_1.UseGuards)(github_auth_guard_1.GitHubAuthGuard),
    (0, common_1.Get)('/github/callback'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authGitHubCallback", null);
__decorate([
    (0, common_1.UseGuards)(facebook_auth_guard_1.FaceBookAuthGuard),
    (0, common_1.Get)('/facebook'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authFaceBook", null);
__decorate([
    (0, common_1.Redirect)('/user', 302),
    (0, common_1.UseGuards)(facebook_auth_guard_1.FaceBookAuthGuard),
    (0, common_1.Get)('/facebook/callback'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authFaceBookCallback", null);
__decorate([
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, common_1.Get)('/google'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authGoogle", null);
__decorate([
    (0, common_1.Redirect)('/user', 302),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, common_1.Get)('/google/callback'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authGoogleCallback", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth/api'),
    __metadata("design:paramtypes", [refresh_token_service_1.RefreshTokenService, auth_service_1.AuthService, users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map