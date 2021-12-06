"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const reviews_service_1 = require("./reviews.service");
const review_model_1 = require("./review.model");
const review_tags_model_1 = require("./review.tags.model");
const tag_model_1 = require("../tags/tag.model");
const title_groups_model_1 = require("../titles/title.groups.model");
let ReviewsModule = class ReviewsModule {
};
ReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([review_model_1.Review, review_tags_model_1.ReviewTags, title_groups_model_1.TitleGroups, tag_model_1.Tag])
        ],
        controllers: [],
        providers: [
            reviews_service_1.ReviewsService
        ],
        exports: [
            reviews_service_1.ReviewsService,
        ]
    })
], ReviewsModule);
exports.ReviewsModule = ReviewsModule;
//# sourceMappingURL=reviews.module.js.map