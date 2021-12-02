"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const ratings_service_1 = require("./ratings.service");
const rating_model_1 = require("./rating.model");
let RatingsModule = class RatingsModule {
};
RatingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([rating_model_1.Rating]),
        ],
        controllers: [],
        providers: [
            ratings_service_1.RatingsService
        ],
        exports: [
            ratings_service_1.RatingsService
        ]
    })
], RatingsModule);
exports.RatingsModule = RatingsModule;
//# sourceMappingURL=ratings.module.js.map