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
exports.ReviewTags = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const review_model_1 = require("./review.model");
const tag_model_1 = require("../tags/tag.model");
let ReviewTags = class ReviewTags extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => review_model_1.Review),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ReviewTags.prototype, "reviewId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => tag_model_1.Tag),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ReviewTags.prototype, "tagId", void 0);
ReviewTags = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'review_tags', createdAt: false, updatedAt: false })
], ReviewTags);
exports.ReviewTags = ReviewTags;
//# sourceMappingURL=review.tags.model.js.map