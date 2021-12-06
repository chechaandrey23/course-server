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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const users_service_1 = require("../entries/users/users.service");
const roles_service_1 = require("../entries/roles/roles.service");
const themes_service_1 = require("../entries/themes/themes.service");
const langs_service_1 = require("../entries/langs/langs.service");
const userinfos_service_1 = require("../entries/userinfos/userinfos.service");
const groups_service_1 = require("../entries/groups/groups.service");
const titles_service_1 = require("../entries/titles/titles.service");
const reviews_service_1 = require("../entries/reviews/reviews.service");
const images_service_1 = require("../entries/images/images.service");
const tags_service_1 = require("../entries/tags/tags.service");
const ratings_service_1 = require("../entries/ratings/ratings.service");
const likes_service_1 = require("../entries/likes/likes.service");
const comments_service_1 = require("../entries/comments/comments.service");
const jwt_access_auth_guard_1 = require("../auth/guards/jwt.access.auth.guard");
const jwt_is_refresh_auth_guard_1 = require("../auth/guards/jwt.is.refresh.auth.guard");
const editor_role_guard_1 = require("../auth/guards/editor.role.guard");
let EditorController = class EditorController {
    constructor(users, roles, langs, themes, userInfos, groups, titles, reviews, images, tags, ratings, likes, comments) {
        this.users = users;
        this.roles = roles;
        this.langs = langs;
        this.themes = themes;
        this.userInfos = userInfos;
        this.groups = groups;
        this.titles = titles;
        this.reviews = reviews;
        this.images = images;
        this.tags = tags;
        this.ratings = ratings;
        this.likes = likes;
        this.comments = comments;
        this.countRows = 20;
        this.countImageRows = 20;
    }
    async getReviewAll(req, page = 1, tags, titles, groups, sortField, sortType) {
        return await this.reviews.getReviewAll({
            condUserId: req.user.id, limit: this.countRows, offset: (page - 1) * this.countRows,
            withTags: tags, withTitles: titles, withGroups: groups,
            sortField: sortField, sortType: sortType
        });
    }
    async getFullReview(req, id) {
        return await this.reviews.getReviewOne({ reviewId: id, condUserId: req.user.id });
    }
    async newReview(req) {
        return await this.reviews.createReview('', '', 0, req.user.id, 0, 0, true, [], false, true);
    }
    async editReview(req, id, description, text, authorRating, titleId, groupId, draft, tags) {
        return await this.reviews.editReview(id, description, text, authorRating, req.user.id, titleId, groupId, draft, tags, false);
    }
    async removeReview(req, id) {
        return await this.reviews.removeReview(id);
    }
    async newTitle(title, description) {
        return await this.titles.createTitle(title, description);
    }
    async newTag(tag) {
        return await this.tags.createTag(tag);
    }
    async getImageAll(page = 1) {
        return await this.images.getImageAll(this.countImageRows, (page - 1) * this.countImageRows, false);
    }
    async newImage(req, images) {
        return await this.images.createImage(req.user.id, images);
    }
};
__decorate([
    (0, common_1.Get)('/reviews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('tags')),
    __param(3, (0, common_1.Query)('titles')),
    __param(4, (0, common_1.Query)('groups')),
    __param(5, (0, common_1.Query)('sortField')),
    __param(6, (0, common_1.Query)('sortType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Array, Array, Array, String, String]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "getReviewAll", null);
__decorate([
    (0, common_1.Get)('/review/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "getFullReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/review-new'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/review-edit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('id')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('text')),
    __param(4, (0, common_1.Body)('authorRating')),
    __param(5, (0, common_1.Body)('titleId')),
    __param(6, (0, common_1.Body)('groupId')),
    __param(7, (0, common_1.Body)('draft')),
    __param(8, (0, common_1.Body)('tags')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, Number, Number, Number, Boolean, Array]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "editReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/review-remove'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "removeReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/title-new'),
    __param(0, (0, common_1.Body)('title')),
    __param(1, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newTitle", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/tag-new'),
    __param(0, (0, common_1.Body)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newTag", null);
__decorate([
    (0, common_1.Get)('/images'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "getImageAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/image-new'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images[]', 1)),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newImage", null);
EditorController = __decorate([
    (0, common_1.UseGuards)(editor_role_guard_1.EditorRoleGuard),
    (0, common_1.UseGuards)(jwt_access_auth_guard_1.JWTAccessAuthGuard),
    (0, common_1.Controller)('/editor'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        roles_service_1.RolesService,
        langs_service_1.LangsService,
        themes_service_1.ThemesService,
        userinfos_service_1.UserInfosService,
        groups_service_1.GroupsService,
        titles_service_1.TitlesService,
        reviews_service_1.ReviewsService,
        images_service_1.ImagesService,
        tags_service_1.TagsService,
        ratings_service_1.RatingsService,
        likes_service_1.LikesService,
        comments_service_1.CommentsService])
], EditorController);
exports.EditorController = EditorController;
//# sourceMappingURL=editor.controller.js.map