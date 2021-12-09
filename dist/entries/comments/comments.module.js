"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const review_elastic_search_module_1 = require("../reviewelasticsearch/review.elastic.search.module");
const comments_service_1 = require("./comments.service");
const search_comment_service_1 = require("./search.comment.service");
const comment_model_1 = require("./comment.model");
const review_model_1 = require("../reviews/review.model");
let CommentsModule = class CommentsModule {
};
CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([comment_model_1.Comment, review_model_1.Review]),
            review_elastic_search_module_1.ReviewElasticSearchModule
        ],
        controllers: [],
        providers: [
            comments_service_1.CommentsService,
            search_comment_service_1.SearchCommentService
        ],
        exports: [
            comments_service_1.CommentsService,
            search_comment_service_1.SearchCommentService
        ]
    })
], CommentsModule);
exports.CommentsModule = CommentsModule;
//# sourceMappingURL=comments.module.js.map