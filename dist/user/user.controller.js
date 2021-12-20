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
const id_dto_1 = require("../dto/id.dto");
const page_dto_1 = require("../dto/page.dto");
const reviews_filter_ext_dto_1 = require("../dto/reviews.filter.ext.dto");
const userinfo_edit_without_dto_1 = require("../dto/userinfo.edit.without.dto");
const rating_add_without_dto_1 = require("../dto/rating.add.without.dto");
const like_add_without_dto_1 = require("../dto/like.add.without.dto");
const search_dto_1 = require("../dto/search.dto");
const comments_dto_1 = require("../dto/comments.dto");
const comments_autoupdate_dto_1 = require("../dto/comments.autoupdate.dto");
const comment_add_without_dto_1 = require("../dto/comment.add.without.dto");
const comment_edit_without_dto_1 = require("../dto/comment.edit.without.dto");
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
    async getDescriptionOrderReviews(req, reviewsFilterExtDTO) {
        return await this.reviews.getReviewAll({
            condPublic: true, condBlocked: false, limit: this.countRows, offset: (reviewsFilterExtDTO.page - 1) * this.countRows,
            withTags: reviewsFilterExtDTO.tags, withTitles: reviewsFilterExtDTO.titles,
            withGroups: reviewsFilterExtDTO.groups, withAuthors: reviewsFilterExtDTO.authors,
            sortField: reviewsFilterExtDTO.sortField, sortType: reviewsFilterExtDTO.sortType,
            forUserId: req.user.id
        });
    }
    async getFullReview(req, idDTO) {
        return await this.reviews.getReviewOne({ reviewId: idDTO.id, forUserId: req.user.id, condPublic: true, condBlocked: false });
    }
    async getUserObject(req) {
        return await this.users.getUserOne(req.user.id);
    }
    async setUserSettings(req, userInfoEditWithoutDTO) {
        return await this.userInfos.editUserInfo(Object.assign({ userId: req.user.id }, userInfoEditWithoutDTO));
    }
    async getUserLangAll() {
        return await this.langs.getShortLangAll();
    }
    async getUserThemeAll() {
        return await this.themes.getShortThemeAll();
    }
    async serUserRating(req, ratingAddWithoutDTO) {
        return await this.ratings.createRating(Object.assign(Object.assign({}, ratingAddWithoutDTO), { userId: req.user.id }));
    }
    async serUserLike(req, likeAddWithoutDTO) {
        return await this.likes.createLike(Object.assign(Object.assign({}, likeAddWithoutDTO), { userId: req.user.id, like: true }));
    }
    async getComments(req, commentsDTO) {
        return await this.comments.getCommentReviewAll(this.countRows, (commentsDTO.page - 1) * this.countRows, commentsDTO.reviewId, true, false);
    }
    async autoUpdateComments(req, commentsAutoUpdateDTO) {
        return await this.comments.getAutoUpdateCommentAll(commentsAutoUpdateDTO.time, commentsAutoUpdateDTO.reviewId, true, false);
    }
    async newComment(req, commentAddWithoutDTO) {
        return await this.searchComment.createCommentWithIndexing(Object.assign(Object.assign({}, commentAddWithoutDTO), { userId: req.user.id, draft: false, blocked: false }));
    }
    async editComment(req, commentEditWithoutDTO) {
        return await this.searchComment.updateCommentWithIndexing(Object.assign(Object.assign({}, commentEditWithoutDTO), { userId: req.user.id, draft: false }));
    }
    async removeComment(req, idDTO) {
        return await this.searchComment.removeCommentWithIndexing(Object.assign(Object.assign({}, idDTO), { userId: req.user.id }));
    }
    async getReviewSearchAll(req, searchDTO, pageDTO) {
        return await this.searchReview.getSearchAll(searchDTO.query, {
            limit: this.countRows, offset: (pageDTO.page - 1) * this.countRows, condPublic: true, blocked: false, forUserId: req.user.id
        });
    }
};
__decorate([
    (0, common_1.Get)('/reviews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reviews_filter_ext_dto_1.ReviewsFilterExtDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDescriptionOrderReviews", null);
__decorate([
    (0, common_1.Get)('/review/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, id_dto_1.IdDTO]),
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
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, userinfo_edit_without_dto_1.UserInfoEditWithoutDTO]),
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
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rating_add_without_dto_1.RatingAddWithoutDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "serUserRating", null);
__decorate([
    (0, common_1.Post)('/like-new'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, like_add_without_dto_1.LikeAddWithoutDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "serUserLike", null);
__decorate([
    (0, common_1.Get)('/comments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comments_dto_1.CommentsDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getComments", null);
__decorate([
    (0, common_1.Get)('/auto-update-comments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comments_autoupdate_dto_1.CommentsAutoUpdateDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "autoUpdateComments", null);
__decorate([
    (0, common_1.Post)('/new-comment'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_add_without_dto_1.CommentAddWithoutDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newComment", null);
__decorate([
    (0, common_1.Post)('/edit-comment'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_edit_without_dto_1.CommentEditWithoutDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editComment", null);
__decorate([
    (0, common_1.Post)('/remove-comment'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeComment", null);
__decorate([
    (0, common_1.Get)('/search/:query'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_dto_1.SearchDTO, page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getReviewSearchAll", null);
UserController = __decorate([
    (0, common_1.UseGuards)(user_role_guard_1.UserRoleGuard),
    (0, common_1.UseGuards)(jwt_access_auth_guard_1.JWTAccessAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
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