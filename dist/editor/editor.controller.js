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
const search_review_service_1 = require("../entries/reviews/search.review.service");
const jwt_access_auth_guard_1 = require("../auth/guards/jwt.access.auth.guard");
const jwt_is_refresh_auth_guard_1 = require("../auth/guards/jwt.is.refresh.auth.guard");
const editor_role_guard_1 = require("../auth/guards/editor.role.guard");
const id_dto_1 = require("../dto/id.dto");
const page_dto_1 = require("../dto/page.dto");
const title_add_dto_1 = require("../dto/title.add.dto");
const tag_add_dto_1 = require("../dto/tag.add.dto");
const reviews_filter_dto_1 = require("../dto/reviews.filter.dto");
const review_add_without_dto_1 = require("../dto/review.add.without.dto");
const review_edit_without_dto_1 = require("../dto/review.edit.without.dto");
let EditorController = class EditorController {
    constructor(users, roles, langs, themes, userInfos, groups, titles, reviews, images, tags, ratings, likes, comments, searchReview) {
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
        this.countRows = 10;
        this.countImageRows = 20;
    }
    async getReviewAll(req, reviewsFilterDTO) {
        return await this.reviews.getReviewAll({
            condUserId: req.user.id, limit: this.countRows, offset: (reviewsFilterDTO.page - 1) * this.countRows,
            withTags: reviewsFilterDTO.tags, withTitles: reviewsFilterDTO.titles, withGroups: reviewsFilterDTO.groups,
            sortField: reviewsFilterDTO.sortField, sortType: reviewsFilterDTO.sortType
        });
    }
    async getFullReview(req, idDTO) {
        return await this.reviews.getReviewOne({ reviewId: idDTO.id, condUserId: req.user.id });
    }
    async newReview(req, reviewAddWithoutDTO) {
        return await this.searchReview.createReviewWithIndexing(Object.assign(Object.assign({}, reviewAddWithoutDTO), { userId: req.user.id, blocked: false }));
    }
    async editReview(req, reviewEditWithoutDTO) {
        return await this.searchReview.updateReviewWithIndexing(Object.assign(Object.assign({}, reviewEditWithoutDTO), { userId: req.user.id }));
    }
    async removeReview(req, idDTO) {
        return await this.searchReview.removeReviewWithDeleteIndex(Object.assign(Object.assign({}, idDTO), { userId: req.user.id }));
    }
    async newTitle(titleAddDTO) {
        return await this.titles.createTitle(titleAddDTO.title, titleAddDTO.description);
    }
    async newTag(tagAddDTO) {
        return await this.tags.createTag(tagAddDTO.tag);
    }
    async getImageAll(req, pageDTO) {
        return await this.images.getImageAll({ limit: this.countImageRows, offset: (pageDTO.page - 1) * this.countImageRows, condUserId: req.user.id });
    }
    async newImage(req, images) {
        return await this.images.createImage({ userId: req.user.id, images });
    }
};
__decorate([
    (0, common_1.Get)('/reviews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reviews_filter_dto_1.ReviewsFilterDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "getReviewAll", null);
__decorate([
    (0, common_1.Get)('/review/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "getFullReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/review-new'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, review_add_without_dto_1.ReviewAddWithoutDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/review-edit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, review_edit_without_dto_1.ReviewEditWithoutDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "editReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/review-remove'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "removeReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/title-new'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [title_add_dto_1.TitleAddDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newTitle", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/tag-new'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_add_dto_1.TagAddDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newTag", null);
__decorate([
    (0, common_1.Get)('/images'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "getImageAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_is_refresh_auth_guard_1.JWTIsRefreshAuthGuard),
    (0, common_1.Post)('/image-new'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images[]', 1, {
        limits: {
            fileSize: 3 * 1024 * 1024
        },
        fileFilter: (req, file, callback) => {
            if (file.originalname.length > 100)
                callback(new common_1.ConflictException('Origin filename must been not more than 100 characters'));
            if (!/^image\//i.test(file.mimetype))
                callback(new common_1.ConflictException('Invalid mime file type'));
            callback(null, true);
        }
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], EditorController.prototype, "newImage", null);
EditorController = __decorate([
    (0, common_1.UseGuards)(editor_role_guard_1.EditorRoleGuard),
    (0, common_1.UseGuards)(jwt_access_auth_guard_1.JWTAccessAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
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
        comments_service_1.CommentsService,
        search_review_service_1.SearchReviewService])
], EditorController);
exports.EditorController = EditorController;
//# sourceMappingURL=editor.controller.js.map