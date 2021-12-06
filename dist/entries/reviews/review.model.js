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
exports.Review = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("../users/user.model");
const tag_model_1 = require("../tags/tag.model");
const review_tags_model_1 = require("./review.tags.model");
const title_groups_model_1 = require("../titles/title.groups.model");
const rating_model_1 = require("../ratings/rating.model");
const like_model_1 = require("../likes/like.model");
let Review = class Review extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], Review.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "blocked", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], Review.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], Review.prototype, "text", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], Review.prototype, "draft", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Review.prototype, "authorRating", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Review.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Review.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => tag_model_1.Tag, () => review_tags_model_1.ReviewTags),
    __metadata("design:type", Array)
], Review.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => title_groups_model_1.TitleGroups),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Review.prototype, "titleGroupId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => title_groups_model_1.TitleGroups),
    __metadata("design:type", title_groups_model_1.TitleGroups)
], Review.prototype, "groupTitle", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => rating_model_1.Rating),
    __metadata("design:type", rating_model_1.Rating)
], Review.prototype, "ratings", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => like_model_1.Like),
    __metadata("design:type", like_model_1.Like)
], Review.prototype, "likes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Review.prototype, "searchId", void 0);
Review = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'reviews', timestamps: true, paranoid: true, deletedAt: true })
], Review);
exports.Review = Review;
//# sourceMappingURL=review.model.js.map