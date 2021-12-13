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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
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
const search_review_service_1 = require("../entries/reviews/search.review.service");
const search_comment_service_1 = require("../entries/comments/search.comment.service");
const jwt_access_auth_guard_1 = require("../auth/guards/jwt.access.auth.guard");
const user_role_guard_1 = require("../auth/guards/user.role.guard");
let UserController = class UserController {
    constructor(users, roles, langs, themes, userInfos, groups, titles, reviews, images, tags, ratings, likes, comments, searchReview, searchComment) {
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
        this.searchReview = searchReview;
        this.searchComment = searchComment;
        this.countRows = 10;
    }
    async getDescriptionOrderReviews(req, page = 1, tags, titles, groups, authors, sortField, sortType) {
        return await this.reviews.getReviewAll({
            condPublic: true, condBlocked: false, limit: this.countRows, offset: (page - 1) * this.countRows,
            withTags: tags, withTitles: titles, withGroups: groups, withAuthors: authors,
            sortField: sortField, sortType: sortType,
            forUserId: req.user.id
        });
    }
    async getFullReview(req, id) {
        return await this.reviews.getReviewOne({ reviewId: id, forUserId: req.user.id, condPublic: true, condBlocked: false });
    }
    async getUserObject(req) {
        return await this.users.getUserOne(req.user.id);
    }
    async setUserSettings(req, id, first_name, last_name, themeId, langId) {
        return await this.userInfos.editUserInfo({ id, userId: req.user.id, first_name, last_name, themeId, langId });
    }
    async getUserLangAll() {
        return await this.langs.getShortLangAll();
    }
    async getUserThemeAll() {
        return await this.themes.getShortThemeAll();
    }
    async serUserRating(req, reviewId, rating) {
        return await this.ratings.createRating({ reviewId, userId: req.user.id, rating });
    }
    async serUserLike(req, reviewId) {
        return await this.likes.createLike({ reviewId, userId: req.user.id, like: true });
    }
    async getComments(req, page = 1, reviewId) {
        return await this.comments.getCommentReviewAll(this.countRows, (page - 1) * this.countRows, reviewId, true, false);
    }
    async autoUpdateComments(req, time, reviewId) {
        return await this.comments.getAutoUpdateCommentAll(time, reviewId, true, false);
    }
    async newComment(req, reviewId, comment) {
        return await this.searchComment.createCommentWithIndexing({ reviewId, userId: req.user.id, comment, draft: false, blocked: false });
    }
    async editComment(req, id, reviewId, comment) {
        return await this.searchComment.updateCommentWithIndexing({ id, reviewId, userId: req.user.id, comment, draft: false });
    }
    async removeComment(req, id) {
        return await this.searchComment.removeCommentWithIndexing({ id, userId: req.user.id });
    }
    async getReviewSearchAll(query, page = 1) {
        return await this.searchReview.getSearchAll(query, { limit: this.countRows, offset: (page - 1) * this.countRows, condPublic: true, blocked: false });
    }
};
__decorate([
    (0, common_1.Get)('/reviews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('tags')),
    __param(3, (0, common_1.Query)('titles')),
    __param(4, (0, common_1.Query)('groups')),
    __param(5, (0, common_1.Query)('authors')),
    __param(6, (0, common_1.Query)('sortField')),
    __param(7, (0, common_1.Query)('sortType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Array, Array, Array, Array, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDescriptionOrderReviews", null);
__decorate([
    (0, common_1.Get)('/review/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFullReview", null);
__decorate([
    (0, common_1.Get)('/user'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserObject", null);
__decorate([
    (0, common_1.Post)('/user-settings'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('id')),
    __param(2, (0, common_1.Body)('first_name')),
    __param(3, (0, common_1.Body)('last_name')),
    __param(4, (0, common_1.Body)('themeId')),
    __param(5, (0, common_1.Body)('langId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setUserSettings", null);
__decorate([
    (0, common_1.Get)('/langs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserLangAll", null);
__decorate([
    (0, common_1.Get)('/themes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserThemeAll", null);
__decorate([
    (0, common_1.Post)('/rating-new'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('reviewId')),
    __param(2, (0, common_1.Body)('rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "serUserRating", null);
__decorate([
    (0, common_1.Post)('/like-new'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "serUserLike", null);
__decorate([
    (0, common_1.Get)('/comments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getComments", null);
__decorate([
    (0, common_1.Get)('/auto-update-comments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('time')),
    __param(2, (0, common_1.Query)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "autoUpdateComments", null);
__decorate([
    (0, common_1.Post)('/new-comment'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('reviewId')),
    __param(2, (0, common_1.Body)('comment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newComment", null);
__decorate([
    (0, common_1.Post)('/edit-comment'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('id')),
    __param(2, (0, common_1.Body)('reviewId')),
    __param(3, (0, common_1.Body)('comment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editComment", null);
__decorate([
    (0, common_1.Post)('/remove-comment'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeComment", null);
__decorate([
    (0, common_1.Get)('/search/:query'),
    __param(0, (0, common_1.Param)('query')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getReviewSearchAll", null);
UserController = __decorate([
    (0, common_1.UseGuards)(user_role_guard_1.UserRoleGuard),
    (0, common_1.UseGuards)(jwt_access_auth_guard_1.JWTAccessAuthGuard),
    (0, common_1.Controller)('/user'),
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
        comments_service_1.CommentsService,
        search_review_service_1.SearchReviewService,
        search_comment_service_1.SearchCommentService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map