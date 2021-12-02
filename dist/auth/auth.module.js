"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../entries/users/users.module");
const refresh_token_module_1 = require("../entries/refreshtoken/refresh.token.module");
const local_strategy_1 = require("./strategy/local.strategy");
const jwt_access_strategy_1 = require("./strategy/jwt.access.strategy");
const jwt_refresh_strategy_1 = require("./strategy/jwt.refresh.strategy");
const jwt_is_refresh_strategy_1 = require("./strategy/jwt.is.refresh.strategy");
const github_strategy_1 = require("./strategy/github.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            refresh_token_module_1.RefreshTokenModule,
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({}),
        ],
        controllers: [
            auth_controller_1.AuthController
        ],
        providers: [
            local_strategy_1.LocalStrategy,
            auth_service_1.AuthService,
            jwt_access_strategy_1.JwtAccessStrategy,
            jwt_refresh_strategy_1.JwtRefreshStrategy,
            jwt_is_refresh_strategy_1.JwtIsRefreshStrategy,
            github_strategy_1.GitHubStrategy
        ],
        exports: [
            auth_service_1.AuthService
        ]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map