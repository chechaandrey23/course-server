"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const users_service_1 = require("./users.service");
const user_model_1 = require("./user.model");
const user_roles_model_1 = require("./user.roles.model");
const role_model_1 = require("../roles/role.model");
const userinfo_model_1 = require("../userinfos/userinfo.model");
const theme_model_1 = require("../themes/theme.model");
const lang_model_1 = require("../langs/lang.model");
const refresh_token_model_1 = require("../refreshtoken/refresh.token.model");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([user_model_1.User, user_roles_model_1.UserRoles, role_model_1.Role, userinfo_model_1.UserInfo, theme_model_1.Theme, lang_model_1.Lang, refresh_token_model_1.RefreshToken])
        ],
        controllers: [],
        providers: [
            users_service_1.UsersService
        ],
        exports: [
            users_service_1.UsersService,
        ]
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map