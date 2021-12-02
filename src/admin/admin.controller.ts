import {Body, Controller, Get, Post, Param, Query, UploadedFile, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor, AnyFilesInterceptor} from '@nestjs/platform-express';

import {Express} from 'express';

import {UsersService} from '../entries/users/users.service';
import {RolesService} from '../entries/roles/roles.service';
import {ThemesService} from '../entries/themes/themes.service';
import {LangsService} from '../entries/langs/langs.service';
import {UserInfosService} from '../entries/userinfos/userinfos.service';
import {GroupsService} from '../entries/groups/groups.service';
import {TitlesService} from '../entries/titles/titles.service';
import {ReviewsService} from '../entries/reviews/reviews.service';
import {ImagesService} from '../entries/images/images.service';
import {TagsService} from '../entries/tags/tags.service';
import {RatingsService} from '../entries/ratings/ratings.service';
import {LikesService} from '../entries/likes/likes.service';
import {CommentsService} from '../entries/comments/comments.service';

@Controller('admin/api')
export class AdminController {
	constructor(
		private users: UsersService,
		private roles: RolesService,
		private langs: LangsService,
		private themes: ThemesService,
		private userInfos: UserInfosService,
		private groups: GroupsService,
		private titles: TitlesService,
		private reviews: ReviewsService,
		private images: ImagesService,
		private tags: TagsService,
		private ratings: RatingsService,
		private likes: LikesService,
		private comments: CommentsService
	) {}

	protected readonly countRows: number = 20;

	// user
	@Get('/users')
	public async getUsers(@Query('page') page: number = 1) {
		return await this.users.getUserAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/users/add')
	public async addUser(@Body('user') user: string, @Body('password') password: string, @Body('email') email: string) {
		return await this.users.createUser(user, password, email);
	}

	@Post('/users/add-social')
	public async addSocialUser(@Body('social_id') social_id: string, @Body('vendor') vendor: string) {
		return await this.users.createSocialUser(social_id, vendor);
	}

	@Post('/users/edit')
	public async editUserAdmin(@Body('id') id: number, @Body('user') user: string, @Body('social_id') social_id: string, @Body('email') emial: string, @Body('blocked') blocked: boolean, @Body('activated') activated: boolean, @Body('roles') roles: number[]) {
		return await this.users.editUserAdmin(id, user, social_id, emial, blocked, activated, roles);
	}

	@Post('/users/remove')
	public async removeUser(@Body('id') id: number) {
		return await this.users.removeUser(id);
	}

	@Post('/users/delete')
	public async deleteUser(@Body('id') id: number) {
		return await this.users.deleteUser(id);
	}

	protected shortUsersCount: number = 150;

	@Get('/users-short')
	public async getShortUsers(@Query('page') page: number = 1) {
		return await this.users.getShortUserAll(this.shortUsersCount, (page-1)*this.countRows);
	}

	@Get('/users-editor-short')
	public async getShortEditorUsers(@Query('page') page: number = 1) {
		return await this.users.getShortEditorUserAll(this.shortUsersCount, (page-1)*this.countRows);
	}

	@Get('/users-user-short')
	public async getShortUserUsers(@Query('page') page: number = 1) {
		return await this.users.getShortUserUserAll(this.shortUsersCount, (page-1)*this.countRows);
	}

	@Get('/user-roles')
	public async getUserRoleAll(@Query('page') page: number = 1) {
		return await this.users.getUserRoleAll(this.countRows, (page-1)*this.countRows);
	}

	// userInfo
	@Get('/user-infos')
	public async getUserInfos(@Query('page') page: number = 1) {
		return await this.userInfos.getUserInfoAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/user-info/add')
	public async addUserInfo(@Body('userId') userId: number) {
		return await this.userInfos.createUserInfo(userId);
	}

	@Post('/user-info/edit')
	public async editUserInfo(@Body('id') id: number, @Body('first_name') first_name: string, @Body('last_name') last_name: string, @Body('theme') themeId: number, @Body('lang') langId: number) {
		return await this.userInfos.editUserInfo(id, first_name, last_name, themeId, langId);
	}

	@Post('/user-info/remove')
	public async removeUserInfo(@Body('id') id: number) {
		return await this.userInfos.removeUserInfo(id);
	}

	@Post('/user-info/delete')
	public async deleteUserInfo(@Body('id') id: number) {
		return await this.userInfos.deleteUserInfo(id);
	}


	// roles
	@Get('/roles')
	public async getRoles(@Query('page') page: number = 1) {
		return await this.roles.getRoleAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/roles/add')
	public async addRole(@Body('role') role: number, @Body('title') title: string, @Body('description') description: string) {
		return await this.roles.createRole(role, title, description);
	}

	@Post('/roles/edit')
	public async editRole(@Body('id') id: number, @Body('role') role: number, @Body('title') title: string, @Body('description') description: string) {
		return await this.roles.editRole(id, role, title, description);
	}

	@Post('/roles/remove')
	public async removeRole(@Body('id') id: number) {
		return await this.roles.removeRole(id);
	}

	@Post('/roles/delete')
	public async deleteRole(@Body('id') id: number) {
		return await this.roles.deleteRole(id);
	}

	@Get('/roles-short')
	public async getShortRoles() {
		return await this.roles.getShortRoleAll();
	}



	// langs
	@Get('/langs')
	public async getLangs(@Query('page') page: number = 1) {
		return await this.langs.getLangAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/langs/add')
	public async addLang(@Body('lang') lang: string, @Body('title') title: string, @Body('description') description: string) {
		return await this.langs.createLang(lang, title, description);
	}

	@Post('/langs/edit')
	public async editLang(@Body('id') id: number, @Body('lang') lang: string, @Body('title') title: string, @Body('description') description: string) {
		return await this.langs.editLang(id, lang, title, description);
	}

	@Post('/langs/remove')
	public async removeLang(@Body('id') id: number) {
		return await this.langs.removeLang(id);
	}

	@Post('/langs/delete')
	public async deleteLang(@Body('id') id: number) {
		return await this.langs.deleteLang(id);
	}

	@Get('/langs-short')
	public async getShortLangs() {
		return await this.langs.getShortLangAll();
	}



	// themes
	@Get('/themes')
	public async getThemes(@Query('page') page: number = 1) {
		return await this.themes.getThemeAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/themes/add')
	public async addTheme(@Body('theme') theme: string, @Body('title') title: string, @Body('description') description: string) {
		return await this.themes.createTheme(theme, title, description);
	}

	@Post('/themes/edit')
	public async editTheme(@Body('id') id: number, @Body('theme') theme: string, @Body('title') title: string, @Body('description') description: string) {
		return await this.themes.editTheme(id, theme, title, description);
	}

	@Post('/themes/remove')
	public async removeTheme(@Body('id') id: number) {
		return await this.themes.removeTheme(id);
	}

	@Post('/themes/delete')
	public async deleteTheme(@Body('id') id: number) {
		return await this.themes.deleteTheme(id);
	}

	@Get('/themes-short')
	public async getShortThemes() {
		return await this.themes.getShortThemeAll();
	}



	// groups
	@Get('/groups')
	public async getGroups(@Query('page') page: number = 1) {
		return await this.groups.getGroupAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/groups/add')
	public async addGroup(@Body('group') group: string, @Body('description') description: string) {
		return await this.groups.createGroup(group, description);
	}

	@Post('/groups/edit')
	public async editGroup(@Body('id') id: number, @Body('group') group: string, @Body('description') description: string) {
		return await this.groups.editGroup(id, group, description);
	}

	@Post('/groups/remove')
	public async removeGroup(@Body('id') id: number) {
		return await this.groups.removeGroup(id);
	}

	@Post('/groups/delete')
	public async deleteGroup(@Body('id') id: number) {
		return await this.groups.deleteGroup(id);
	}

	@Get('/groups-short')
	public async getShortGroups() {
		return await this.groups.getShortGroupAll();
	}

	// titles
	@Get('/titles')
	public async getTitles(@Query('page') page: number = 1) {
		return await this.titles.getTitleAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/titles/add')
	public async addTitle(@Body('title') title: string, @Body('description') description: string) {
		return await this.titles.createTitle(title, description);
	}

	@Post('/titles/edit')
	public async editTitle(@Body('id') id: number, @Body('title') title: string, @Body('description') description: string) {
		return await this.titles.editTitle(id, title, description);
	}

	@Post('/titles/remove')
	public async removeTitle(@Body('id') id: number) {
		return await this.titles.removeTitle(id);
	}

	@Post('/titles/delete')
	public async deleteTitle(@Body('id') id: number) {
		return await this.titles.deleteTitle(id);
	}

	@Get('/title-groups')
	public async getTitleGroupAll(@Query('page') page: number = 1) {
		return await this.titles.getTitleGroupAll(this.countRows, (page-1)*this.countRows);
	}

	@Get('/titles-short')
	public async getShortTitles(@Query('page') page: number = 1) {
		return await this.titles.getShortTitleAll(this.countRows, (page-1)*this.countRows);
	}


	// reviews
	@Get('/reviews')
	public async getReviews(@Query('page') page: number = 1) {
		return await this.reviews.getReviewAll({withDeleted: true, limit: this.countRows, offset: (page-1)*this.countRows});
	}

	@Get('/reviews-short')
	public async getShortReviews() {
		return await this.reviews.getShortReviewAll();
	}

	@Post('/reviews/add')
	public async addReview(@Body('description') description: string, @Body('text') text: string, @Body('authorRating') authorRating: number, @Body('userId') userId: number, @Body('titleId') titleId: number, @Body('groupId') groupId: number, @Body('draft') draft: boolean, @Body('tags') tags: number[]) {
		return await this.reviews.createReview(description, text, authorRating, userId, titleId, groupId, draft, tags);
	}

	@Post('/reviews/edit')
	public async editReview(@Body('id') id: number, @Body('description') description: string, @Body('text') text: string, @Body('authorRating') authorRating: number, @Body('userId') userId: number, @Body('titleId') titleId: number, @Body('groupId') groupId: number, @Body('draft') draft: boolean, @Body('tags') tags: number[]) {
		return await this.reviews.editReview(id, description, text, authorRating, userId, titleId, groupId, draft, tags);
	}

	@Post('/reviews/remove')
	public async removeReview(@Body('id') id: number) {
		return await this.reviews.removeReview(id);
	}

	@Post('/reviews/delete')
	public async deleteReview(@Body('id') id: number) {
		return await this.reviews.deleteReview(id);
	}

	@Get('/review-tags')
	public async getReviewTagAll(@Query('page') page: number = 1) {
		return await this.reviews.getReviewTagAll(this.countRows, (page-1)*this.countRows);
	}


	// images
	@Get('/images')
	public async getImages(@Query('page') page: number = 1) {
		return await this.images.getImageAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/images/add')
	@UseInterceptors(FilesInterceptor('images[]', 3))
	public async addImage(@Body('userId') userId: number, @UploadedFiles() images: Array<Express.Multer.File>) {
		return await this.images.createImage(/*reviewId, */userId, images);
	}

	@Post('/images/edit')
	public async editImage(@Body('id') id: number, @Body('userId') userId: number) {
		return await this.images.editImage(id, /*reviewId, */userId);
	}

	@Post('/images/remove')
	public async removeImage(@Body('id') id: number) {
		return await this.images.removeImage(id);
	}

	@Post('/images/delete')
	public async deleteImage(@Body('id') id: number) {
		return await this.images.deleteImage(id);
	}



	// tags
	@Get('/tags')
	public async getTags(@Query('page') page: number = 1) {
		return await this.tags.getTagAll({withDeleted: true, limit: this.countRows, offset: (page-1)*this.countRows});
	}

	@Post('/tags/add')
	public async addTag(@Body('tag') tag: string) {
		return await this.tags.createTag(tag);
	}

	@Post('/tags/edit')
	public async editTag(@Body('id') id: number, @Body('tag') tag: string) {
		return await this.tags.editTag(id, tag);
	}

	@Post('/tags/remove')
	public async removeTag(@Body('id') id: number) {
		return await this.tags.removeTag(id);
	}

	@Post('/tags/delete')
	public async deleteTag(@Body('id') id: number) {
		return await this.tags.deleteTag(id);
	}

	@Get('/tags-short')
	public async getShortTags() {
		return await this.tags.getShortTagAll();
	}

	// ratings
	@Get('/ratings')
	public async getRatings(@Query('page') page: number = 1) {
		return await this.ratings.getRatingAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/ratings/add')
	public async addRating(@Body('reviewId') reviewId: number, @Body('userId') userId: number, @Body('rating') rating: number) {
		return await this.ratings.createRating(reviewId, userId, rating);
	}

	@Post('/ratings/edit')
	public async editRating(@Body('id') id: number, @Body('reviewId') reviewId: number, @Body('userId') userId: number, @Body('rating') rating: number) {
		return await this.ratings.editRating(id, reviewId, userId, rating);
	}

	@Post('/ratings/remove')
	public async removeRating(@Body('id') id: number) {
		return await this.ratings.removeRating(id);
	}

	@Post('/ratings/delete')
	public async deleteRating(@Body('id') id: number) {
		return await this.ratings.deleteRating(id);
	}



	// likes
	@Get('/likes')
	public async getLikes(@Query('page') page: number = 1) {
		return await this.likes.getLikeAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/likes/add')
	public async addLike(@Body('reviewId') reviewId: number, @Body('userId') userId: number, @Body('like') like: boolean) {
		return await this.likes.createLike(reviewId, userId, like);
	}

	@Post('/likes/edit')
	public async editLike(@Body('id') id: number, @Body('reviewId') reviewId: number, @Body('userId') userId: number, @Body('like') like: boolean) {
		return await this.likes.editLike(id, reviewId, userId, like);
	}

	@Post('/likes/remove')
	public async removeLike(@Body('id') id: number) {
		return await this.likes.removeLike(id);
	}

	@Post('/likes/delete')
	public async deleteLike(@Body('id') id: number) {
		return await this.likes.deleteLike(id);
	}


	// comments
	@Get('/comments')
	public async getComments(@Query('page') page: number = 1) {
		return await this.comments.getCommentAll(this.countRows, (page-1)*this.countRows, true);
	}

	@Post('/comments/add')
	public async addComment(@Body('reviewId') reviewId: number, @Body('userId') userId: number, @Body('comment') comment: string, @Body('draft') draft: boolean, @Body('blocked') blocked: boolean) {
		return await this.comments.createComment(reviewId, userId, comment, draft, blocked);
	}

	@Post('/comments/edit')
	public async editComment(@Body('id') id: number, @Body('reviewId') reviewId: number, @Body('userId') userId: number, @Body('comment') comment: string, @Body('draft') draft: boolean, @Body('blocked') blocked: boolean) {
		return await this.comments.editComment(id, reviewId, userId, comment, draft, blocked);
	}

	@Post('/comments/remove')
	public async removeComment(@Body('id') id: number) {
		return await this.comments.removeComment(id);
	}

	@Post('/comments/delete')
	public async deleteComment(@Body('id') id: number) {
		return await this.comments.deleteComment(id);
	}
}
