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
const id_dto_1 = require("../dto/id.dto");
const page_dto_1 = require("../dto/page.dto");
const reviewid_dto_1 = require("../dto/reviewid.dto");
const reviewsearchid_dto_1 = require("../dto/reviewsearchid.dto");
const comment_add_dto_1 = require("../dto/comment.add.dto");
const comment_edit_dto_1 = require("../dto/comment.edit.dto");
const group_add_dto_1 = require("../dto/group.add.dto");
const group_edit_dto_1 = require("../dto/group.edit.dto");
const image_add_dto_1 = require("../dto/image.add.dto");
const image_edit_dto_1 = require("../dto/image.edit.dto");
const lang_add_dto_1 = require("../dto/lang.add.dto");
const lang_edit_dto_1 = require("../dto/lang.edit.dto");
const like_add_dto_1 = require("../dto/like.add.dto");
const like_edit_dto_1 = require("../dto/like.edit.dto");
const rating_add_dto_1 = require("../dto/rating.add.dto");
const rating_edit_dto_1 = require("../dto/rating.edit.dto");
const review_add_dto_1 = require("../dto/review.add.dto");
const review_edit_dto_1 = require("../dto/review.edit.dto");
const role_add_dto_1 = require("../dto/role.add.dto");
const role_edit_dto_1 = require("../dto/role.edit.dto");
const tag_add_dto_1 = require("../dto/tag.add.dto");
const tag_edit_dto_1 = require("../dto/tag.edit.dto");
const theme_add_dto_1 = require("../dto/theme.add.dto");
const theme_edit_dto_1 = require("../dto/theme.edit.dto");
const title_add_dto_1 = require("../dto/title.add.dto");
const title_edit_dto_1 = require("../dto/title.edit.dto");
const user_add_dto_1 = require("../dto/user.add.dto");
const user_edit_dto_1 = require("../dto/user.edit.dto");
const user_social_add_dto_1 = require("../dto/user.social.add.dto");
const userinfo_add_dto_1 = require("../dto/userinfo.add.dto");
const userinfo_edit_dto_1 = require("../dto/userinfo.edit.dto");
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
        this.shortTitlesCount = 150;
    }
    async getRefreshTokens(pageDTO) {
        return await this.refreshTokens.refreshTokenGetAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async deleteRefreshToken(idDTO) {
        return await this.refreshTokens.refreshTokenDelete(idDTO.id);
    }
    async eraseRefreshToken(idDTO) {
        return await this.refreshTokens.refreshTokenErase(idDTO.id);
    }
    async getReviewForSearchAll(pageDTO) {
        return await this.searchReview.getReviewForSearchAll({ withDeleted: true, limit: this.countRows, offset: (pageDTO.page - 1) * this.countRows });
    }
    async getReviewIndexElasticSearch(reviewSearchIdDTO) {
        return await this.searchReview.getDualReviewIndex(reviewSearchIdDTO.reviewId, reviewSearchIdDTO.searchId, true);
    }
    async indexReviewElasticSearch(reviewIdDTO) {
        return await this.searchReview.createIndex(reviewIdDTO.reviewId);
    }
    async deleteIndexReviewElasticSearch(reviewSearchIdDTO) {
        return await this.searchReview.deleteIndex(reviewSearchIdDTO.reviewId, reviewSearchIdDTO.searchId);
    }
    async getUsers(pageDTO) {
        return await this.users.getUserAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addUser(userAddDTO) {
        return await this.users.createUser(userAddDTO.user, userAddDTO.password, userAddDTO.email, userAddDTO.first_name, userAddDTO.last_name);
    }
    async addSocialUser(userSocialAddDTO) {
        return await this.users.createSocialUser(userSocialAddDTO.social_id, userSocialAddDTO.vendor, userSocialAddDTO.soft_create, userSocialAddDTO.displayName);
    }
    async editUserAdmin(userEditDTO) {
        return await this.users.editUserAdmin(userEditDTO.id, userEditDTO.user, userEditDTO.social_id, userEditDTO.email, userEditDTO.blocked, userEditDTO.activated, userEditDTO.roles);
    }
    async removeUser(idDTO) {
        return await this.users.removeUser(idDTO.id);
    }
    async restoreUser(idDTO) {
        return await this.users.restoreUser(idDTO.id);
    }
    async deleteUser(idDTO) {
        return await this.users.deleteUser(idDTO.id);
    }
    async getShortUsers(pageDTO) {
        return await this.users.getShortUserAll(this.shortUsersCount, (pageDTO.page - 1) * this.countRows);
    }
    async getShortEditorUsers(pageDTO) {
        return await this.users.getShortEditorUserAll(this.shortUsersCount, (pageDTO.page - 1) * this.countRows);
    }
    async getShortUserUsers(pageDTO) {
        return await this.users.getShortUserUserAll(this.shortUsersCount, (pageDTO.page - 1) * this.countRows);
    }
    async getUserRoleAll(pageDTO) {
        return await this.users.getUserRoleAll(this.countRows, (pageDTO.page - 1) * this.countRows);
    }
    async getUserInfos(pageDTO) {
        return await this.userInfos.getUserInfoAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addUserInfo(userInfoAddDTO) {
        return await this.userInfos.createUserInfo(userInfoAddDTO);
    }
    async editUserInfo(userInfoEditDTO) {
        return await this.userInfos.editUserInfo(Object.assign(Object.assign({}, userInfoEditDTO), { superEdit: true }));
    }
    async removeUserInfo(idDTO) {
        return await this.userInfos.removeUserInfo({ id: idDTO.id, superEdit: true });
    }
    async restoreUserInfo(idDTO) {
        return await this.userInfos.restoreUserInfo({ id: idDTO.id, superEdit: true });
    }
    async deleteUserInfo(idDTO) {
        return await this.userInfos.deleteUserInfo({ id: idDTO.id, superEdit: true });
    }
    async getRoles(pageDTO) {
        return await this.roles.getRoleAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addRole(roleAddDTO) {
        return await this.roles.createRole(roleAddDTO.role, roleAddDTO.title, roleAddDTO.description);
    }
    async editRole(roleEditDTO) {
        return await this.roles.editRole(roleEditDTO.id, roleEditDTO.role, roleEditDTO.title, roleEditDTO.description);
    }
    async removeRole(idDTO) {
        return await this.roles.removeRole(idDTO.id);
    }
    async restoreRole(idDTO) {
        return await this.roles.restoreRole(idDTO.id);
    }
    async deleteRole(idDTO) {
        return await this.roles.deleteRole(idDTO.id);
    }
    async getShortRoles() {
        return await this.roles.getShortRoleAll();
    }
    async getLangs(pageDTO) {
        return await this.langs.getLangAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addLang(langAddDTO) {
        return await this.langs.createLang(langAddDTO.lang, langAddDTO.title, langAddDTO.description);
    }
    async editLang(langEditDTO) {
        return await this.langs.editLang(langEditDTO.id, langEditDTO.lang, langEditDTO.title, langEditDTO.description);
    }
    async removeLang(idDTO) {
        return await this.langs.removeLang(idDTO.id);
    }
    async restoreLang(idDTO) {
        return await this.langs.restoreLang(idDTO.id);
    }
    async deleteLang(idDTO) {
        return await this.langs.deleteLang(idDTO.id);
    }
    async getShortLangs() {
        return await this.langs.getShortLangAll();
    }
    async getThemes(pageDTO) {
        return await this.themes.getThemeAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addTheme(themeAddDTO) {
        return await this.themes.createTheme(themeAddDTO.theme, themeAddDTO.title, themeAddDTO.description);
    }
    async editTheme(themeEditDTO) {
        return await this.themes.editTheme(themeEditDTO.id, themeEditDTO.theme, themeEditDTO.title, themeEditDTO.description);
    }
    async removeTheme(idDTO) {
        return await this.themes.removeTheme(idDTO.id);
    }
    async restoreTheme(idDTO) {
        return await this.themes.restoreTheme(idDTO.id);
    }
    async deleteTheme(idDTO) {
        return await this.themes.deleteTheme(idDTO.id);
    }
    async getShortThemes() {
        return await this.themes.getShortThemeAll();
    }
    async getGroups(pageDTO) {
        return await this.groups.getGroupAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addGroup(groupAddDTO) {
        return await this.groups.createGroup(groupAddDTO.group, groupAddDTO.description);
    }
    async editGroup(groupEditDTO) {
        return await this.groups.editGroup(groupEditDTO.id, groupEditDTO.group, groupEditDTO.description);
    }
    async removeGroup(idDTO) {
        return await this.groups.removeGroup(idDTO.id);
    }
    async restoreGroup(idDTO) {
        return await this.groups.restoreGroup(idDTO.id);
    }
    async deleteGroup(idDTO) {
        return await this.groups.deleteGroup(idDTO.id);
    }
    async getShortGroups() {
        return await this.groups.getShortGroupAll();
    }
    async getTitles(pageDTO) {
        return await this.titles.getTitleAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addTitle(titleAddDTO) {
        return await this.titles.createTitle(titleAddDTO.title, titleAddDTO.description);
    }
    async editTitle(titleEditDTO) {
        return await this.titles.editTitle(titleEditDTO.id, titleEditDTO.title, titleEditDTO.description);
    }
    async removeTitle(idDTO) {
        return await this.titles.removeTitle(idDTO.id);
    }
    async restoreTitle(idDTO) {
        return await this.titles.restoreTitle(idDTO.id);
    }
    async deleteTitle(idDTO) {
        return await this.titles.deleteTitle(idDTO.id);
    }
    async getTitleGroupAll(pageDTO) {
        return await this.titles.getTitleGroupAll(this.countRows, (pageDTO.page - 1) * this.countRows);
    }
    async getShortTitles(pageDTO) {
        return await this.titles.getShortTitleAll(this.shortTitlesCount, (pageDTO.page - 1) * this.shortTitlesCount);
    }
    async getReviews(pageDTO) {
        return await this.reviews.getReviewAll({ withDeleted: true, limit: this.countRows, offset: (pageDTO.page - 1) * this.countRows });
    }
    async getReview(reviewIdDTO) {
        return await this.reviews.getReviewOne(Object.assign({ withDeleted: true }, reviewIdDTO));
    }
    async getShortReviews() {
        return await this.reviews.getShortReviewAll();
    }
    async addReview(reviewAddDTO) {
        return await this.searchReview.createReviewWithIndexing(reviewAddDTO);
    }
    async editReview(reviewEditDTO) {
        return await this.searchReview.updateReviewWithIndexing(Object.assign(Object.assign({}, reviewEditDTO), { superEdit: true }));
    }
    async removeReview(idDTO) {
        return await this.searchReview.removeReviewWithDeleteIndex(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async restoreReview(idDTO) {
        return await this.searchReview.restoreReviewWithDeleteIndex(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async deleteReview(idDTO) {
        return await this.searchReview.deleteReviewWithDeleteIndex(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async getReviewTagAll(pageDTO) {
        return await this.reviews.getReviewTagAll(this.countRows, (pageDTO.page - 1) * this.countRows);
    }
    async getImages(pageDTO) {
        return await this.images.getImageAll({ withDeleted: true, limit: this.countRows, offset: (pageDTO.page - 1) * this.countRows });
    }
    async addImage(imageAddDTO, images) {
        return await this.images.createImage(Object.assign(Object.assign({}, imageAddDTO), { images }));
    }
    async editImage(imageEditDTO) {
        return await this.images.editImage(Object.assign(Object.assign({}, imageEditDTO), { superEdit: true }));
    }
    async removeImage(idDTO) {
        return await this.images.removeImage(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async restoreImage(idDTO) {
        return await this.images.restoreImage(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async deleteImage(idDTO) {
        return await this.images.deleteImage(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async getTags(pageDTO) {
        return await this.tags.getTagAll({ withDeleted: true, limit: this.countRows, offset: (pageDTO.page - 1) * this.countRows });
    }
    async addTag(tagAddDTO) {
        return await this.tags.createTag(tagAddDTO.tag);
    }
    async editTag(tagEditDTO) {
        return await this.tags.editTag(tagEditDTO.id, tagEditDTO.tag);
    }
    async removeTag(idDTO) {
        return await this.tags.removeTag(idDTO.id);
    }
    async restoreTag(idDTO) {
        return await this.tags.restoreTag(idDTO.id);
    }
    async deleteTag(idDTO) {
        return await this.tags.deleteTag(idDTO.id);
    }
    async getShortTags() {
        return await this.tags.getShortTagAll();
    }
    async getRatings(pageDTO) {
        return await this.ratings.getRatingAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addRating(ratingAddDTO) {
        return await this.ratings.createRating(ratingAddDTO);
    }
    async editRating(ratingEditDTO) {
        return await this.ratings.editRating(Object.assign(Object.assign({}, ratingEditDTO), { superEdit: true }));
    }
    async removeRating(idDTO) {
        return await this.ratings.removeRating(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async restoreRating(idDTO) {
        return await this.ratings.restoreRating(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async deleteRating(idDTO) {
        return await this.ratings.deleteRating(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async getLikes(pageDTO) {
        return await this.likes.getLikeAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addLike(likeAddDTO) {
        return await this.likes.createLike(likeAddDTO);
    }
    async editLike(likeEditDTO) {
        return await this.likes.editLike(Object.assign(Object.assign({}, likeEditDTO), { superEdit: true }));
    }
    async removeLike(idDTO) {
        return await this.likes.removeLike(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async restoreLike(idDTO) {
        return await this.likes.restoreLike(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async deleteLike(idDTO) {
        return await this.likes.deleteLike(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async getComments(pageDTO) {
        return await this.comments.getCommentAll(this.countRows, (pageDTO.page - 1) * this.countRows, true);
    }
    async addComment(commentAddDTO) {
        return await this.searchComment.createCommentWithIndexing(commentAddDTO);
    }
    async editComment(commentEditDTO) {
        return await this.searchComment.updateCommentWithIndexing(Object.assign(Object.assign({}, commentEditDTO), { superEdit: true }));
    }
    async removeComment(idDTO) {
        return await this.searchComment.removeCommentWithIndexing(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async restoreComment(idDTO) {
        return await this.searchComment.restoreCommentWithIndexing(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
    async deleteComment(idDTO) {
        return await this.searchComment.deleteCommentWithIndexing(Object.assign(Object.assign({}, idDTO), { superEdit: true }));
    }
};
__decorate([
    (0, common_1.Get)('/refresh-tokens'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRefreshTokens", null);
__decorate([
    (0, common_1.Post)('/refresh-tokens/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRefreshToken", null);
__decorate([
    (0, common_1.Post)('/refresh-tokens/erase'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "eraseRefreshToken", null);
__decorate([
    (0, common_1.Get)('/elastic-search-reviews'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviewForSearchAll", null);
__decorate([
    (0, common_1.Get)('/elastic-search-review/full'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviewsearchid_dto_1.ReviewSearchIdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviewIndexElasticSearch", null);
__decorate([
    (0, common_1.Post)('/elastic-search-review/indexing'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviewid_dto_1.ReviewIdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "indexReviewElasticSearch", null);
__decorate([
    (0, common_1.Post)('/elastic-search-review/delete-index'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviewsearchid_dto_1.ReviewSearchIdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteIndexReviewElasticSearch", null);
__decorate([
    (0, common_1.Get)('/users'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('/users/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_add_dto_1.UserAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addUser", null);
__decorate([
    (0, common_1.Post)('/users/add-social'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_social_add_dto_1.UserSocialAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addSocialUser", null);
__decorate([
    (0, common_1.Post)('/users/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_edit_dto_1.UserEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editUserAdmin", null);
__decorate([
    (0, common_1.Post)('/users/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeUser", null);
__decorate([
    (0, common_1.Post)('/users/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreUser", null);
__decorate([
    (0, common_1.Post)('/users/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/users-short'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortUsers", null);
__decorate([
    (0, common_1.Get)('/users-editor-short'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortEditorUsers", null);
__decorate([
    (0, common_1.Get)('/users-user-short'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortUserUsers", null);
__decorate([
    (0, common_1.Get)('/user-roles'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserRoleAll", null);
__decorate([
    (0, common_1.Get)('/user-infos'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserInfos", null);
__decorate([
    (0, common_1.Post)('/user-info/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userinfo_add_dto_1.UserInfoAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userinfo_edit_dto_1.UserInfoEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreUserInfo", null);
__decorate([
    (0, common_1.Post)('/user-info/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUserInfo", null);
__decorate([
    (0, common_1.Get)('/roles'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Post)('/roles/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_add_dto_1.RoleAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addRole", null);
__decorate([
    (0, common_1.Post)('/roles/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_edit_dto_1.RoleEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editRole", null);
__decorate([
    (0, common_1.Post)('/roles/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeRole", null);
__decorate([
    (0, common_1.Post)('/roles/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreRole", null);
__decorate([
    (0, common_1.Post)('/roles/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
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
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLangs", null);
__decorate([
    (0, common_1.Post)('/langs/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lang_add_dto_1.LangAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addLang", null);
__decorate([
    (0, common_1.Post)('/langs/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lang_edit_dto_1.LangEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editLang", null);
__decorate([
    (0, common_1.Post)('/langs/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeLang", null);
__decorate([
    (0, common_1.Post)('/langs/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreLang", null);
__decorate([
    (0, common_1.Post)('/langs/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
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
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getThemes", null);
__decorate([
    (0, common_1.Post)('/themes/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [theme_add_dto_1.ThemeAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTheme", null);
__decorate([
    (0, common_1.Post)('/themes/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [theme_edit_dto_1.ThemeEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTheme", null);
__decorate([
    (0, common_1.Post)('/themes/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeTheme", null);
__decorate([
    (0, common_1.Post)('/themes/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreTheme", null);
__decorate([
    (0, common_1.Post)('/themes/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
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
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getGroups", null);
__decorate([
    (0, common_1.Post)('/groups/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [group_add_dto_1.GroupAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addGroup", null);
__decorate([
    (0, common_1.Post)('/groups/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [group_edit_dto_1.GroupEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editGroup", null);
__decorate([
    (0, common_1.Post)('/groups/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeGroup", null);
__decorate([
    (0, common_1.Post)('/groups/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreGroup", null);
__decorate([
    (0, common_1.Post)('/groups/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
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
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTitles", null);
__decorate([
    (0, common_1.Post)('/titles/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [title_add_dto_1.TitleAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTitle", null);
__decorate([
    (0, common_1.Post)('/titles/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [title_edit_dto_1.TitleEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTitle", null);
__decorate([
    (0, common_1.Post)('/titles/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeTitle", null);
__decorate([
    (0, common_1.Post)('/titles/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreTitle", null);
__decorate([
    (0, common_1.Post)('/titles/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTitle", null);
__decorate([
    (0, common_1.Get)('/title-groups'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTitleGroupAll", null);
__decorate([
    (0, common_1.Get)('/titles-short'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getShortTitles", null);
__decorate([
    (0, common_1.Get)('/reviews'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Get)('/review-full'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reviewid_dto_1.ReviewIdDTO]),
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_add_dto_1.ReviewAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addReview", null);
__decorate([
    (0, common_1.Post)('/reviews/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_edit_dto_1.ReviewEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editReview", null);
__decorate([
    (0, common_1.Post)('/reviews/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeReview", null);
__decorate([
    (0, common_1.Post)('/reviews/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreReview", null);
__decorate([
    (0, common_1.Post)('/reviews/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('/review-tags'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviewTagAll", null);
__decorate([
    (0, common_1.Get)('/images'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getImages", null);
__decorate([
    (0, common_1.Post)('/images/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images[]', 3, {
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
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [image_add_dto_1.ImageAddDTO, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addImage", null);
__decorate([
    (0, common_1.Post)('/images/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [image_edit_dto_1.ImageEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editImage", null);
__decorate([
    (0, common_1.Post)('/images/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeImage", null);
__decorate([
    (0, common_1.Post)('/images/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreImage", null);
__decorate([
    (0, common_1.Post)('/images/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Get)('/tags'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTags", null);
__decorate([
    (0, common_1.Post)('/tags/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_add_dto_1.TagAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTag", null);
__decorate([
    (0, common_1.Post)('/tags/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_edit_dto_1.TagEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editTag", null);
__decorate([
    (0, common_1.Post)('/tags/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeTag", null);
__decorate([
    (0, common_1.Post)('/tags/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreTag", null);
__decorate([
    (0, common_1.Post)('/tags/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
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
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRatings", null);
__decorate([
    (0, common_1.Post)('/ratings/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rating_add_dto_1.RatingAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addRating", null);
__decorate([
    (0, common_1.Post)('/ratings/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rating_edit_dto_1.RatingEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editRating", null);
__decorate([
    (0, common_1.Post)('/ratings/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeRating", null);
__decorate([
    (0, common_1.Post)('/ratings/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreRating", null);
__decorate([
    (0, common_1.Post)('/ratings/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRating", null);
__decorate([
    (0, common_1.Get)('/likes'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLikes", null);
__decorate([
    (0, common_1.Post)('/likes/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [like_add_dto_1.LikeAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addLike", null);
__decorate([
    (0, common_1.Post)('/likes/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [like_edit_dto_1.LikeEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editLike", null);
__decorate([
    (0, common_1.Post)('/likes/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeLike", null);
__decorate([
    (0, common_1.Post)('/likes/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreLike", null);
__decorate([
    (0, common_1.Post)('/likes/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLike", null);
__decorate([
    (0, common_1.Get)('/comments'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.PageDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('/comments/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_add_dto_1.CommentAddDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)('/comments/edit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_edit_dto_1.CommentEditDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editComment", null);
__decorate([
    (0, common_1.Post)('/comments/remove'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeComment", null);
__decorate([
    (0, common_1.Post)('/comments/restore'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "restoreComment", null);
__decorate([
    (0, common_1.Post)('/comments/delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.IdDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteComment", null);
AdminController = __decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
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