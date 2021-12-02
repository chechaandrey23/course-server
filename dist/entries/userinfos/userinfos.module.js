"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfosModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const userinfos_service_1 = require("./userinfos.service");
const userinfo_model_1 = require("./userinfo.model");
const theme_model_1 = require("../themes/theme.model");
const lang_model_1 = require("../langs/lang.model");
const user_model_1 = require("../users/user.model");
let UserInfosModule = class UserInfosModule {
};
UserInfosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([userinfo_model_1.UserInfo, theme_model_1.Theme, lang_model_1.Lang, user_model_1.User])
        ],
        controllers: [],
        providers: [
            userinfos_service_1.UserInfosService
        ],
        exports: [
            userinfos_service_1.UserInfosService
        ]
    })
], UserInfosModule);
exports.UserInfosModule = UserInfosModule;
//# sourceMappingURL=userinfos.module.js.map