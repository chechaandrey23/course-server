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
exports.AdminController = void 0;
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
const refresh_token_service_1 = require("../entries/refreshtoken/refresh.token.service");
const search_review_service_1 = require("../entries/reviews/search.review.service");
const search_comment_service_1 = require("../entries/comments/search.comment.service");
let AdminController = class AdminController {
    constructor(users, roles, langs, themes, userInfos, groups, titles, reviews, images, tags, ratings, likes, comments, refreshTokens, searchReview, searchComment) {
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
        this.refreshTokens = refreshTokens;
        this.searchReview = searchReview;
        this.searchComment = searchComment;
        this.countRows = 20;
        this.shortUsersCount = 150;
    }
    async getRefreshTokens(page = 1) {
        return await this.refreshTokens.refreshTokenGetAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async deleteRefreshToken(id) {
        return await this.refreshTokens.refreshTokenDelete(id);
    }
    async eraseRefreshToken(id) {
        return await this.refreshTokens.refreshTokenErase(id);
    }
    async getReviewForSearchAll(page = 1) {
        return await this.searchReview.getReviewForSearchAll({ withDeleted: true, limit: this.countRows, offset: (page - 1) * this.countRows });
    }
    async getReviewIndexElasticSearch(reviewId, searchId) {
        return await this.searchReview.getDualReviewIndex(reviewId, searchId);
    }
    async indexReviewElasticSearch(reviewId) {
        return await this.searchReview.createIndex(reviewId);
    }
    async deleteIndexReviewElasticSearch(reviewId, searchId) {
        return await this.searchReview.deleteIndex(reviewId, searchId);
    }
    async getUsers(page = 1) {
        return await this.users.getUserAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addUser(user, password, email, first_name, last_name) {
        return await this.users.createUser(user, password, email, first_name, last_name);
    }
    async addSocialUser(social_id, vendor, soft_create, displayName) {
        return await this.users.createSocialUser(social_id, vendor, soft_create, displayName);
    }
    async editUserAdmin(id, user, social_id, emial, blocked, activated, roles) {
        return await this.users.editUserAdmin(id, user, social_id, emial, blocked, activated, roles);
    }
    async removeUser(id) {
        return await this.users.removeUser(id);
    }
    async restoreUser(id) {
        return await this.users.restoreUser(id);
    }
    async deleteUser(id) {
        return await this.users.deleteUser(id);
    }
    async getShortUsers(page = 1) {
        return await this.users.getShortUserAll(this.shortUsersCount, (page - 1) * this.countRows);
    }
    async getShortEditorUsers(page = 1) {
        return await this.users.getShortEditorUserAll(this.shortUsersCount, (page - 1) * this.countRows);
    }
    async getShortUserUsers(page = 1) {
        return await this.users.getShortUserUserAll(this.shortUsersCount, (page - 1) * this.countRows);
    }
    async getUserRoleAll(page = 1) {
        return await this.users.getUserRoleAll(this.countRows, (page - 1) * this.countRows);
    }
    async getUserInfos(page = 1) {
        return await this.userInfos.getUserInfoAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addUserInfo(userId) {
        return await this.userInfos.createUserInfo(userId);
    }
    async editUserInfo(id, userId, first_name, last_name, themeId, langId) {
        return await this.userInfos.editUserInfo(id, userId, first_name, last_name, themeId, langId);
    }
    async removeUserInfo(id) {
        return await this.userInfos.removeUserInfo(id);
    }
    async restoreUserInfo(id) {
        return await this.userInfos.restoreUserInfo(id);
    }
    async deleteUserInfo(id) {
        return await this.userInfos.deleteUserInfo(id);
    }
    async getRoles(page = 1) {
        return await this.roles.getRoleAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addRole(role, title, description) {
        return await this.roles.createRole(role, title, description);
    }
    async editRole(id, role, title, description) {
        return await this.roles.editRole(id, role, title, description);
    }
    async removeRole(id) {
        return await this.roles.removeRole(id);
    }
    async restoreRole(id) {
        return await this.roles.restoreRole(id);
    }
    async deleteRole(id) {
        return await this.roles.deleteRole(id);
    }
    async getShortRoles() {
        return await this.roles.getShortRoleAll();
    }
    async getLangs(page = 1) {
        return await this.langs.getLangAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addLang(lang, title, description) {
        return await this.langs.createLang(lang, title, description);
    }
    async editLang(id, lang, title, description) {
        return await this.langs.editLang(id, lang, title, description);
    }
    async removeLang(id) {
        return await this.langs.removeLang(id);
    }
    async restoreLang(id) {
        return await this.langs.restoreLang(id);
    }
    async deleteLang(id) {
        return await this.langs.deleteLang(id);
    }
    async getShortLangs() {
        return await this.langs.getShortLangAll();
    }
    async getThemes(page = 1) {
        return await this.themes.getThemeAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addTheme(theme, title, description) {
        return await this.themes.createTheme(theme, title, description);
    }
    async editTheme(id, theme, title, description) {
        return await this.themes.editTheme(id, theme, title, description);
    }
    async removeTheme(id) {
        return await this.themes.removeTheme(id);
    }
    async restoreTheme(id) {
        return await this.themes.restoreTheme(id);
    }
    async deleteTheme(id) {
        return await this.themes.deleteTheme(id);
    }
    async getShortThemes() {
        return await this.themes.getShortThemeAll();
    }
    async getGroups(page = 1) {
        return await this.groups.getGroupAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addGroup(group, description) {
        return await this.groups.createGroup(group, description);
    }
    async editGroup(id, group, description) {
        return await this.groups.editGroup(id, group, description);
    }
    async removeGroup(id) {
        return await this.groups.removeGroup(id);
    }
    async restoreGroup(id) {
        return await this.groups.restoreGroup(id);
    }
    async deleteGroup(id) {
        return await this.groups.deleteGroup(id);
    }
    async getShortGroups() {
        return await this.groups.getShortGroupAll();
    }
    async getTitles(page = 1) {
        return await this.titles.getTitleAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addTitle(title, description) {
        return await this.titles.createTitle(title, description);
    }
    async editTitle(id, title, description) {
        return await this.titles.editTitle(id, title, description);
    }
    async removeTitle(id) {
        return await this.titles.removeTitle(id);
    }
    async restoreTitle(id) {
        return await this.titles.restoreTitle(id);
    }
    async deleteTitle(id) {
        return await this.titles.deleteTitle(id);
    }
    async getTitleGroupAll(page = 1) {
        return await this.titles.getTitleGroupAll(this.countRows, (page - 1) * this.countRows);
    }
    async getShortTitles(page = 1) {
        return await this.titles.getShortTitleAll(this.countRows, (page - 1) * this.countRows);
    }
    async getReviews(page = 1) {
        return await this.reviews.getReviewAll({ withDeleted: true, limit: this.countRows, offset: (page - 1) * this.countRows });
    }
    async getReview(reviewId) {
        return await this.reviews.getReviewOne({ withDeleted: true, reviewId });
    }
    async getShortReviews() {
        return await this.reviews.getShortReviewAll();
    }
    async addReview(description, text, authorRating, userId, titleId, groupId, draft, tags, blocked) {
        return await this.searchReview.createReviewWithIndexing({ description, text, authorRating, userId, titleId, groupId, draft, tags, blocked });
    }
    async editReview(id, description, text, authorRating, userId, titleId, groupId, draft, tags, blocked) {
        return await this.searchReview.updateReviewWithIndexing({ id, description, text, authorRating, userId, titleId, groupId, draft, tags, blocked });
    }
    async removeReview(id) {
        return await this.reviews.removeReview(id);
    }
    async restoreReview(id) {
        return await this.reviews.restoreReview(id);
    }
    async deleteReview(id) {
        return await this.searchReview.deleteReviewWithDeleteIndex(id);
    }
    async getReviewTagAll(page = 1) {
        return await this.reviews.getReviewTagAll(this.countRows, (page - 1) * this.countRows);
    }
    async getImages(page = 1) {
        return await this.images.getImageAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addImage(userId, images) {
        return await this.images.createImage(userId, images);
    }
    async editImage(id, userId) {
        return await this.images.editImage(id, userId);
    }
    async removeImage(id) {
        return await this.images.removeImage(id);
    }
    async restoreImage(id) {
        return await this.images.restoreImage(id);
    }
    async deleteImage(id) {
        return await this.images.deleteImage(id);
    }
    async getTags(page = 1) {
        return await this.tags.getTagAll({ withDeleted: true, limit: this.countRows, offset: (page - 1) * this.countRows });
    }
    async addTag(tag) {
        return await this.tags.createTag(tag);
    }
    async editTag(id, tag) {
        return await this.tags.editTag(id, tag);
    }
    async removeTag(id) {
        return await this.tags.removeTag(id);
    }
    async restoreTag(id) {
        return await this.tags.restoreTag(id);
    }
    async deleteTag(id) {
        return await this.tags.deleteTag(id);
    }
    async getShortTags() {
        return await this.tags.getShortTagAll();
    }
    async getRatings(page = 1) {
        return await this.ratings.getRatingAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addRating(reviewId, userId, rating) {
        return await this.ratings.createRating(reviewId, userId, rating);
    }
    async editRating(id, reviewId, userId, rating) {
        return await this.ratings.editRating(id, reviewId, userId, rating);
    }
    async removeRating(id) {
        return await this.ratings.removeRating(id);
    }
    async restoreRating(id) {
        return await this.ratings.restoreRating(id);
    }
    async deleteRating(id) {
        return await this.ratings.deleteRating(id);
    }
    async getLikes(page = 1) {
        return await this.likes.getLikeAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addLike(reviewId, userId, like) {
        return await this.likes.createLike(reviewId, userId, like);
    }
    async editLike(id, reviewId, userId, like) {
        return await this.likes.editLike(id, reviewId, userId, like);
    }
    async removeLike(id) {
        return await this.likes.removeLike(id);
    }
    async restoreLike(id) {
        return await this.likes.restoreLike(id);
    }
    async deleteLike(id) {
        return await this.likes.deleteLike(id);
    }
    async getComments(page = 1) {
        return await this.comments.getCommentAll(this.countRows, (page - 1) * this.countRows, true);
    }
    async addComment(reviewId, userId, comment, draft, blocked) {
        return await this.searchComment.createCommentWithIndexing({ reviewId, userId, comment, draft, blocked });
    }
    async editComment(id, reviewId, userId, comment, draft, blocked) {
        return await this.searchComment.updateCommentWithIndexing({ id, reviewId, userId, comment, draft, blocked });
    }
    async removeComment(id) {
        return await this.comments.removeComment(id);
    }
    async restoreComment(id) {
        return await this.comments.restoreComment(id);
    }
    async deleteComment(id) {
        return await this.searchComment.deleteCommentWithIndexing(id);
    }
};
__decorate([
    (0, common_1.Get)('/refresh-tokens'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRefreshTokens", null);
__decorate([
    (0, common_1.Post)('/refresh-tokens/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRefreshToken", null);
__decorate([
    (0, common_1.Post)('/refresh-tokens/erase'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "eraseRefreshToken", null);
__decorate([
    (0, common_1.Get)('/elastic-search-reviews'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviewForSearchAll", null);
__decorate([
    (0, common_1.Get)('/elastic-search-review/full'),
    __param(0, (0, common_1.Query)('reviewId')),
    __param(1, (0, common_1.Query)('searchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviewIndexElasticSearch", null);
__decorate([
    (0, common_1.Post)('/elastic-search-review/indexing'),
    __param(0, (0, common_1.Body)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "indexReviewElasticSearch", null);
__decorate([
    (0, common_1.Post)('/elastic-search-review/delete-index'),
    __param(0, (0, common_1.Body)('reviewId')),
    __param(1, (0, common_1.Body)('searchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteIndexReviewElasticSearch", null);
__decorate([
    (0, common_1.Get)('/users'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('/users/add'),
    __param(0, (0, common_1.Body)('user')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('first_name')),
    __param(4, (0, common_1.Body)('last_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addUser", null);
__decorate([
    (0, common_1.Post)('/users/add-social'),
    __param(0, (0, common_1.Body)('social_id')),
    __param(1, (0, common_1.Body)('vendor')),
    __param(2, (0, common_1.Body)('soft_create')),
    __param(3, (0, common_1.Body)('displayName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addSocialUser", null);
__decorate([
    (0, common_1.Post)('/users/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('user')),
    __param(2, (0, common_1.Body)('social_id')),
    __param(3, (0, common_1.Body)('email')),
    __param(4, (0, common_1.Body)('blocked')),
    __param(5, (0, common_1.Body)('activated')),
    __param(6, (0, common_1.Body)('roles')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, Boolean, Boolean, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editUserAdmin", null);
__decorate([
    (0, common_1.Post)('/users/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeUser", null);
__decorate([
    (0, common_1.Post)('/users/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreUser", null);
__decorate([
    (0, common_1.Post)('/users/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/users-short'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortUsers", null);
__decorate([
    (0, common_1.Get)('/users-editor-short'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortEditorUsers", null);
__decorate([
    (0, common_1.Get)('/users-user-short'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortUserUsers", null);
__decorate([
    (0, common_1.Get)('/user-roles'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserRoleAll", null);
__decorate([
    (0, common_1.Get)('/user-infos'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserInfos", null);
__decorate([
    (0, common_1.Post)('/user-info/add'),
    __param(0, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, common_1.Body)('first_name')),
    __param(3, (0, common_1.Body)('last_name')),
    __param(4, (0, common_1.Body)('theme')),
    __param(5, (0, common_1.Body)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUserInfo", null);
__decorate([
    (0, common_1.Get)('/roles'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Post)('/roles/add'),
    __param(0, (0, common_1.Body)('role')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addRole", null);
__decorate([
    (0, common_1.Post)('/roles/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('role')),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editRole", null);
__decorate([
    (0, common_1.Post)('/roles/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeRole", null);
__decorate([
    (0, common_1.Post)('/roles/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreRole", null);
__decorate([
    (0, common_1.Post)('/roles/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Get)('/roles-short'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortRoles", null);
__decorate([
    (0, common_1.Get)('/langs'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLangs", null);
__decorate([
    (0, common_1.Post)('/langs/add'),
    __param(0, (0, common_1.Body)('lang')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addLang", null);
__decorate([
    (0, common_1.Post)('/langs/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('lang')),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editLang", null);
__decorate([
    (0, common_1.Post)('/langs/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeLang", null);
__decorate([
    (0, common_1.Post)('/langs/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreLang", null);
__decorate([
    (0, common_1.Post)('/langs/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLang", null);
__decorate([
    (0, common_1.Get)('/langs-short'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortLangs", null);
__decorate([
    (0, common_1.Get)('/themes'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getThemes", null);
__decorate([
    (0, common_1.Post)('/themes/add'),
    __param(0, (0, common_1.Body)('theme')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTheme", null);
__decorate([
    (0, common_1.Post)('/themes/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('theme')),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTheme", null);
__decorate([
    (0, common_1.Post)('/themes/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeTheme", null);
__decorate([
    (0, common_1.Post)('/themes/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreTheme", null);
__decorate([
    (0, common_1.Post)('/themes/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTheme", null);
__decorate([
    (0, common_1.Get)('/themes-short'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortThemes", null);
__decorate([
    (0, common_1.Get)('/groups'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getGroups", null);
__decorate([
    (0, common_1.Post)('/groups/add'),
    __param(0, (0, common_1.Body)('group')),
    __param(1, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addGroup", null);
__decorate([
    (0, common_1.Post)('/groups/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('group')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editGroup", null);
__decorate([
    (0, common_1.Post)('/groups/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeGroup", null);
__decorate([
    (0, common_1.Post)('/groups/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreGroup", null);
__decorate([
    (0, common_1.Post)('/groups/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteGroup", null);
__decorate([
    (0, common_1.Get)('/groups-short'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortGroups", null);
__decorate([
    (0, common_1.Get)('/titles'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTitles", null);
__decorate([
    (0, common_1.Post)('/titles/add'),
    __param(0, (0, common_1.Body)('title')),
    __param(1, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTitle", null);
__decorate([
    (0, common_1.Post)('/titles/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTitle", null);
__decorate([
    (0, common_1.Post)('/titles/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeTitle", null);
__decorate([
    (0, common_1.Post)('/titles/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreTitle", null);
__decorate([
    (0, common_1.Post)('/titles/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTitle", null);
__decorate([
    (0, common_1.Get)('/title-groups'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTitleGroupAll", null);
__decorate([
    (0, common_1.Get)('/titles-short'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortTitles", null);
__decorate([
    (0, common_1.Get)('/reviews'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Get)('/review-full'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReview", null);
__decorate([
    (0, common_1.Get)('/reviews-short'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortReviews", null);
__decorate([
    (0, common_1.Post)('/reviews/add'),
    __param(0, (0, common_1.Body)('description')),
    __param(1, (0, common_1.Body)('text')),
    __param(2, (0, common_1.Body)('authorRating')),
    __param(3, (0, common_1.Body)('userId')),
    __param(4, (0, common_1.Body)('titleId')),
    __param(5, (0, common_1.Body)('groupId')),
    __param(6, (0, common_1.Body)('draft')),
    __param(7, (0, common_1.Body)('tags')),
    __param(8, (0, common_1.Body)('blocked')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, Number, Number, Boolean, Array, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addReview", null);
__decorate([
    (0, common_1.Post)('/reviews/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('description')),
    __param(2, (0, common_1.Body)('text')),
    __param(3, (0, common_1.Body)('authorRating')),
    __param(4, (0, common_1.Body)('userId')),
    __param(5, (0, common_1.Body)('titleId')),
    __param(6, (0, common_1.Body)('groupId')),
    __param(7, (0, common_1.Body)('draft')),
    __param(8, (0, common_1.Body)('tags')),
    __param(9, (0, common_1.Body)('blocked')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number, Number, Number, Number, Boolean, Array, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editReview", null);
__decorate([
    (0, common_1.Post)('/reviews/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeReview", null);
__decorate([
    (0, common_1.Post)('/reviews/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreReview", null);
__decorate([
    (0, common_1.Post)('/reviews/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('/review-tags'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviewTagAll", null);
__decorate([
    (0, common_1.Get)('/images'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getImages", null);
__decorate([
    (0, common_1.Post)('/images/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images[]', 3)),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addImage", null);
__decorate([
    (0, common_1.Post)('/images/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editImage", null);
__decorate([
    (0, common_1.Post)('/images/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeImage", null);
__decorate([
    (0, common_1.Post)('/images/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreImage", null);
__decorate([
    (0, common_1.Post)('/images/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Get)('/tags'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTags", null);
__decorate([
    (0, common_1.Post)('/tags/add'),
    __param(0, (0, common_1.Body)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTag", null);
__decorate([
    (0, common_1.Post)('/tags/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTag", null);
__decorate([
    (0, common_1.Post)('/tags/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeTag", null);
__decorate([
    (0, common_1.Post)('/tags/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreTag", null);
__decorate([
    (0, common_1.Post)('/tags/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTag", null);
__decorate([
    (0, common_1.Get)('/tags-short'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortTags", null);
__decorate([
    (0, common_1.Get)('/ratings'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRatings", null);
__decorate([
    (0, common_1.Post)('/ratings/add'),
    __param(0, (0, common_1.Body)('reviewId')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, common_1.Body)('rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addRating", null);
__decorate([
    (0, common_1.Post)('/ratings/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('reviewId')),
    __param(2, (0, common_1.Body)('userId')),
    __param(3, (0, common_1.Body)('rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editRating", null);
__decorate([
    (0, common_1.Post)('/ratings/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeRating", null);
__decorate([
    (0, common_1.Post)('/ratings/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreRating", null);
__decorate([
    (0, common_1.Post)('/ratings/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRating", null);
__decorate([
    (0, common_1.Get)('/likes'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLikes", null);
__decorate([
    (0, common_1.Post)('/likes/add'),
    __param(0, (0, common_1.Body)('reviewId')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, common_1.Body)('like')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addLike", null);
__decorate([
    (0, common_1.Post)('/likes/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('reviewId')),
    __param(2, (0, common_1.Body)('userId')),
    __param(3, (0, common_1.Body)('like')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editLike", null);
__decorate([
    (0, common_1.Post)('/likes/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeLike", null);
__decorate([
    (0, common_1.Post)('/likes/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreLike", null);
__decorate([
    (0, common_1.Post)('/likes/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLike", null);
__decorate([
    (0, common_1.Get)('/comments'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('/comments/add'),
    __param(0, (0, common_1.Body)('reviewId')),
    __param(1, (0, common_1.Body)('userId')),
    __param(2, (0, common_1.Body)('comment')),
    __param(3, (0, common_1.Body)('draft')),
    __param(4, (0, common_1.Body)('blocked')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)('/comments/edit'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('reviewId')),
    __param(2, (0, common_1.Body)('userId')),
    __param(3, (0, common_1.Body)('comment')),
    __param(4, (0, common_1.Body)('draft')),
    __param(5, (0, common_1.Body)('blocked')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editComment", null);
__decorate([
    (0, common_1.Post)('/comments/remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeComment", null);
__decorate([
    (0, common_1.Post)('/comments/restore'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreComment", null);
__decorate([
    (0, common_1.Post)('/comments/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteComment", null);
AdminController = __decorate([
    (0, common_1.Controller)('admin/api'),
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
        refresh_token_service_1.RefreshTokenService,
        search_review_service_1.SearchReviewService,
        search_comment_service_1.SearchCommentService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map