"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemesModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const themes_service_1 = require("./themes.service");
const theme_model_1 = require("./theme.model");
let ThemesModule = class ThemesModule {
};
ThemesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([theme_model_1.Theme]),
        ],
        controllers: [],
        providers: [
            themes_service_1.ThemesService
        ],
        exports: [
            themes_service_1.ThemesService
        ]
    })
], ThemesModule);
exports.ThemesModule = ThemesModule;
//# sourceMappingURL=themes.module.js.map