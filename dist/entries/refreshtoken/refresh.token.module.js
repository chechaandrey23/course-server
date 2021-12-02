"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const refresh_token_service_1 = require("./refresh.token.service");
const refresh_token_model_1 = require("./refresh.token.model");
let RefreshTokenModule = class RefreshTokenModule {
};
RefreshTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([refresh_token_model_1.RefreshToken]),
        ],
        controllers: [],
        providers: [
            refresh_token_service_1.RefreshTokenService
        ],
        exports: [
            refresh_token_service_1.RefreshTokenService
        ]
    })
], RefreshTokenModule);
exports.RefreshTokenModule = RefreshTokenModule;
//# sourceMappingURL=refresh.token.module.js.map