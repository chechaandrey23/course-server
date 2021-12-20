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
exports.GuestController = void 0;
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
const id_dto_1 = require("../dto/id.dto");
const page_dto_1 = require("../dto/page.dto");
const reviews_filter_ext_dto_1 = require("../dto/reviews.filter.ext.dto");
const search_dto_1 = require("../dto/search.dto");
const titles_query_dto_1 = require("../dto/titles.query.dto");
const tags_query_dto_1 = require("../dto/tags.query.dto");
const grouptitleid_dto_1 = require("../dto/grouptitleid.dto");
const tags_order_dto_1 = require("../dto/tags.order.dto");
let GuestController = class GuestController {
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
        this.countTags = 25;
        this.countEditorRows = 20;
    }
    async getDescriptionOrderReviews(reviewsFilterExtDTO) {
        return await this.reviews.getReviewAll({
            condPublic: true, condBlocked: false, limit: this.countRows, offset: (reviewsFilterExtDTO.page - 1) * this.countRows,
            withTags: reviewsFilterExtDTO.tags, withTitles: reviewsFilterExtDTO.titles,
            withGroups: reviewsFilterExtDTO.groups, withAuthors: reviewsFilterExtDTO.authors,
            sortField: reviewsFilterExtDTO.sortField, sortType: reviewsFilterExtDTO.sortType
        });
    }
    async getFullReview(idDTO) {
        return await this.reviews.getReviewOne({ reviewId: idDTO.id, condPublic: true, condBlocked: false });
    }
    async getShortOtherReviews(groupTitleIdDTO) {
        return await this.reviews.getShortOtherReviewAll(groupTitleIdDTO.groupTitleId);
    }
    async getTagOrderReviews(pageDTO, tagsOrderDTO) {
        return await this.tags.getTagAll(Object.assign({ limit: this.countTags, offset: (pageDTO.page - 1) * this.countTags }, tagsOrderDTO));
    }
    async getShortEditorUsers(pageDTO) {
        return await this.users.getShortEditorUserAll(this.countEditorRows, (pageDTO.page - 1) * this.countEditorRows);
    }
    async getGroupAll() {
        return await this.groups.getShortGroupAll();
    }
    async getTitlePart(titlesQueryDTO) {
        return await this.titles.getPartTitleAll(this.countRows, 0, titlesQueryDTO.query);
    }
    async getTagPart(tagsQueryDTO) {
        return await this.tags.getPartTagAll(this.countRows, 0, tagsQueryDTO.query);
    }
    async getReviewSearchAll(searchDTO, pageDTO) {
        return await this.searchReview.getSearchAll(searchDTO.query, {
            limit: this.countRows, offset: (pageDTO.page - 1) * this.countRows, condPublic: true, blocked: false
        });
    }
};
__decorate([
    (0, common_1.Get)('/reviews'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviews_filter_ext_dto_1.ReviewsFilterExtDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getDescriptionOrderReviews", null);
__decorate([
    (0, common_1.Get)('/review/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getFullReview", null);
__decorate([
    (0, common_1.Get)('/other-short-reviews/:groupTitleId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grouptitleid_dto_1.GroupTitleIdDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getShortOtherReviews", null);
__decorate([
    (0, common_1.Get)(['/tags', '/tags/order-:order']),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO, tags_order_dto_1.TagsOrderDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getTagOrderReviews", null);
__decorate([
    (0, common_1.Get)('/editor-short-part'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getShortEditorUsers", null);
__decorate([
    (0, common_1.Get)('/groups'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getGroupAll", null);
__decorate([
    (0, common_1.Get)('/part-titles/:query'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [titles_query_dto_1.TitlesQueryDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getTitlePart", null);
__decorate([
    (0, common_1.Get)('/part-tags/:query'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tags_query_dto_1.TagsQueryDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getTagPart", null);
__decorate([
    (0, common_1.Get)('/search/:query'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.SearchDTO, page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getReviewSearchAll", null);
GuestController = __decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.Controller)('/guest'),
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
], GuestController);
exports.GuestController = GuestController;
//# sourceMappingURL=guest.controller.js.map