import {Body, Controller, Get, Post, Param, Query, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe, UsePipes, ConflictException} from '@nestjs/common';
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

import {RefreshTokenService} from '../entries/refreshtoken/refresh.token.service';

import {SearchReviewService} from '../entries/reviews/search.review.service';
import {SearchCommentService} from '../entries/comments/search.comment.service';

import {JWTAccessAuthGuard} from '../auth/guards/jwt.access.auth.guard';
import {JWTIsRefreshAuthGuard} from '../auth/guards/jwt.is.refresh.auth.guard';
import {AdminRoleGuard} from '../auth/guards/admin.role.guard';

// dtos
import {IdDTO} from '../dto/id.dto';
import {PageDTO} from '../dto/page.dto';
import {ReviewIdDTO} from '../dto/reviewid.dto';
import {ReviewSearchIdDTO} from '../dto/reviewsearchid.dto';
import {CommentAddDTO} from '../dto/comment.add.dto';
import {CommentEditDTO} from '../dto/comment.edit.dto';
import {GroupAddDTO} from '../dto/group.add.dto';
import {GroupEditDTO} from '../dto/group.edit.dto';
import {ImageAddDTO} from '../dto/image.add.dto';
import {ImageEditDTO} from '../dto/image.edit.dto';
import {LangAddDTO} from '../dto/lang.add.dto';
import {LangEditDTO} from '../dto/lang.edit.dto';
import {LikeAddDTO} from '../dto/like.add.dto';
import {LikeEditDTO} from '../dto/like.edit.dto';
import {RatingAddDTO} from '../dto/rating.add.dto';
import {RatingEditDTO} from '../dto/rating.edit.dto';
import {ReviewAddDTO} from '../dto/review.add.dto';
import {ReviewEditDTO} from '../dto/review.edit.dto';
import {RoleAddDTO} from '../dto/role.add.dto';
import {RoleEditDTO} from '../dto/role.edit.dto';
import {TagAddDTO} from '../dto/tag.add.dto';
import {TagEditDTO} from '../dto/tag.edit.dto';
import {ThemeAddDTO} from '../dto/theme.add.dto';
import {ThemeEditDTO} from '../dto/theme.edit.dto';
import {TitleAddDTO} from '../dto/title.add.dto';
import {TitleEditDTO} from '../dto/title.edit.dto';
import {UserAddDTO} from '../dto/user.add.dto';
import {UserEditDTO} from '../dto/user.edit.dto';
import {UserSocialAddDTO} from '../dto/user.social.add.dto';
import {UserInfoAddDTO} from '../dto/userinfo.add.dto';
import {UserInfoEditDTO} from '../dto/userinfo.edit.dto';

//@UseGuards(AdminRoleGuard)
//@UseGuards(JWTAccessAuthGuard)
//@UseGuards(JWTIsRefreshAuthGuard)
@UsePipes(new ValidationPipe({transform: true}))
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
		private comments: CommentsService,
		private refreshTokens: RefreshTokenService,
		private searchReview: SearchReviewService,
		private searchComment: SearchCommentService
	) {}

	protected readonly countRows: number = 20;

	// refresh Token
	@Get('/refresh-tokens')
	public async getRefreshTokens(@Query() pageDTO: PageDTO) {
		return await this.refreshTokens.refreshTokenGetAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/refresh-tokens/delete')
	public async deleteRefreshToken(@Body() idDTO: IdDTO) {
		return await this.refreshTokens.refreshTokenDelete(idDTO.id);
	}

	@Post('/refresh-tokens/erase')
	public async eraseRefreshToken(@Body() idDTO: IdDTO) {
		return await this.refreshTokens.refreshTokenErase(idDTO.id);
	}



	// searchs
	@Get('/elastic-search-reviews')
	public async getReviewForSearchAll(@Query() pageDTO: PageDTO) {
		return await this.searchReview.getReviewForSearchAll({withDeleted: true, limit: this.countRows, offset: (pageDTO.page-1)*this.countRows});
	}

	@Get('/elastic-search-review/full')
	public async getReviewIndexElasticSearch(@Query() reviewSearchIdDTO: ReviewSearchIdDTO) {
		return await this.searchReview.getDualReviewIndex(reviewSearchIdDTO.reviewId, reviewSearchIdDTO.searchId, true);
	}

	@Post('/elastic-search-review/indexing')
	public async indexReviewElasticSearch(@Body() reviewIdDTO: ReviewIdDTO) {
		return await this.searchReview.createIndex(reviewIdDTO.reviewId);
	}

	@Post('/elastic-search-review/delete-index')
	public async deleteIndexReviewElasticSearch(@Body() reviewSearchIdDTO: ReviewSearchIdDTO) {
		return await this.searchReview.deleteIndex(reviewSearchIdDTO.reviewId, reviewSearchIdDTO.searchId);
	}



	// user
	@Get('/users')
	public async getUsers(@Query() pageDTO: PageDTO) {
		return await this.users.getUserAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/users/add')
	public async addUser(@Body() userAddDTO: UserAddDTO) {
		return await this.users.createUser(
			userAddDTO.user, userAddDTO.password, userAddDTO.email, userAddDTO.first_name, userAddDTO.last_name
		);
	}

	@Post('/users/add-social')
	public async addSocialUser(@Body() userSocialAddDTO: UserSocialAddDTO) {
		return await this.users.createSocialUser(
			userSocialAddDTO.social_id, userSocialAddDTO.vendor, userSocialAddDTO.soft_create, userSocialAddDTO.displayName
		);
	}

	@Post('/users/edit')
	public async editUserAdmin(@Body() userEditDTO: UserEditDTO) {
		return await this.users.editUserAdmin(
			userEditDTO.id, userEditDTO.user, userEditDTO.social_id, userEditDTO.email, userEditDTO.blocked, userEditDTO.activated, userEditDTO.roles
		);
	}

	@Post('/users/remove')
	public async removeUser(@Body() idDTO: IdDTO) {
		return await this.users.removeUser(idDTO.id);
	}

	@Post('/users/restore')
	public async restoreUser(@Body() idDTO: IdDTO) {
		return await this.users.restoreUser(idDTO.id);
	}

	@Post('/users/delete')
	public async deleteUser(@Body() idDTO: IdDTO) {
		return await this.users.deleteUser(idDTO.id);
	}

	protected shortUsersCount: number = 150;

	@Get('/users-short')
	public async getShortUsers(@Query() pageDTO: PageDTO) {
		return await this.users.getShortUserAll(this.shortUsersCount, (pageDTO.page-1)*this.countRows);
	}

	@Get('/users-editor-short')
	public async getShortEditorUsers(@Query() pageDTO: PageDTO) {
		return await this.users.getShortEditorUserAll(this.shortUsersCount, (pageDTO.page-1)*this.countRows);
	}

	@Get('/users-user-short')
	public async getShortUserUsers(@Query() pageDTO: PageDTO) {
		return await this.users.getShortUserUserAll(this.shortUsersCount, (pageDTO.page-1)*this.countRows);
	}

	@Get('/user-roles')
	public async getUserRoleAll(@Query() pageDTO: PageDTO) {
		return await this.users.getUserRoleAll(this.countRows, (pageDTO.page-1)*this.countRows);
	}

	// userInfo
	@Get('/user-infos')
	public async getUserInfos(@Query() pageDTO: PageDTO) {
		return await this.userInfos.getUserInfoAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/user-info/add')
	public async addUserInfo(@Body() userInfoAddDTO: UserInfoAddDTO) {
		return await this.userInfos.createUserInfo(userInfoAddDTO);
	}

	@Post('/user-info/edit')
	public async editUserInfo(@Body() userInfoEditDTO: UserInfoEditDTO) {
		return await this.userInfos.editUserInfo({...userInfoEditDTO, superEdit: true});
	}

	@Post('/user-info/remove')
	public async removeUserInfo(@Body() idDTO: IdDTO) {
		return await this.userInfos.removeUserInfo({id: idDTO.id, superEdit: true});
	}

	@Post('/user-info/restore')
	public async restoreUserInfo(@Body() idDTO: IdDTO) {
		return await this.userInfos.restoreUserInfo({id: idDTO.id, superEdit: true});
	}

	@Post('/user-info/delete')
	public async deleteUserInfo(@Body() idDTO: IdDTO) {
		return await this.userInfos.deleteUserInfo({id: idDTO.id, superEdit: true});
	}


	// roles
	@Get('/roles')
	public async getRoles(@Query() pageDTO: PageDTO) {
		return await this.roles.getRoleAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/roles/add')
	public async addRole(@Body() roleAddDTO: RoleAddDTO) {
		return await this.roles.createRole(roleAddDTO.role, roleAddDTO.title, roleAddDTO.description);
	}

	@Post('/roles/edit')
	public async editRole(@Body() roleEditDTO: RoleEditDTO) {
		return await this.roles.editRole(roleEditDTO.id, roleEditDTO.role, roleEditDTO.title, roleEditDTO.description);
	}

	@Post('/roles/remove')
	public async removeRole(@Body() idDTO: IdDTO) {
		return await this.roles.removeRole(idDTO.id);
	}

	@Post('/roles/restore')
	public async restoreRole(@Body() idDTO: IdDTO) {
		return await this.roles.restoreRole(idDTO.id);
	}

	@Post('/roles/delete')
	public async deleteRole(@Body() idDTO: IdDTO) {
		return await this.roles.deleteRole(idDTO.id);
	}

	@Get('/roles-short')
	public async getShortRoles() {
		return await this.roles.getShortRoleAll();
	}



	// langs
	@Get('/langs')
	public async getLangs(@Query() pageDTO: PageDTO) {
		return await this.langs.getLangAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/langs/add')
	public async addLang(@Body() langAddDTO: LangAddDTO) {
		return await this.langs.createLang(langAddDTO.lang, langAddDTO.title, langAddDTO.description);
	}

	@Post('/langs/edit')
	public async editLang(@Body() langEditDTO: LangEditDTO) {
		return await this.langs.editLang(langEditDTO.id, langEditDTO.lang, langEditDTO.title, langEditDTO.description);
	}

	@Post('/langs/remove')
	public async removeLang(@Body() idDTO: IdDTO) {
		return await this.langs.removeLang(idDTO.id);
	}

	@Post('/langs/restore')
	public async restoreLang(@Body() idDTO: IdDTO) {
		return await this.langs.restoreLang(idDTO.id);
	}

	@Post('/langs/delete')
	public async deleteLang(@Body() idDTO: IdDTO) {
		return await this.langs.deleteLang(idDTO.id);
	}

	@Get('/langs-short')
	public async getShortLangs() {
		return await this.langs.getShortLangAll();
	}



	// themes
	@Get('/themes')
	public async getThemes(@Query() pageDTO: PageDTO) {
		return await this.themes.getThemeAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/themes/add')
	public async addTheme(@Body() themeAddDTO: ThemeAddDTO) {
		return await this.themes.createTheme(themeAddDTO.theme, themeAddDTO.title, themeAddDTO.description);
	}

	@Post('/themes/edit')
	public async editTheme(@Body() themeEditDTO: ThemeEditDTO) {
		return await this.themes.editTheme(themeEditDTO.id, themeEditDTO.theme, themeEditDTO.title, themeEditDTO.description);
	}

	@Post('/themes/remove')
	public async removeTheme(@Body() idDTO: IdDTO) {
		return await this.themes.removeTheme(idDTO.id);
	}

	@Post('/themes/restore')
	public async restoreTheme(@Body() idDTO: IdDTO) {
		return await this.themes.restoreTheme(idDTO.id);
	}

	@Post('/themes/delete')
	public async deleteTheme(@Body() idDTO: IdDTO) {
		return await this.themes.deleteTheme(idDTO.id);
	}

	@Get('/themes-short')
	public async getShortThemes() {
		return await this.themes.getShortThemeAll();
	}



	// groups
	@Get('/groups')
	public async getGroups(@Query() pageDTO: PageDTO) {
		return await this.groups.getGroupAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/groups/add')
	public async addGroup(@Body() groupAddDTO: GroupAddDTO) {
		return await this.groups.createGroup(groupAddDTO.group, groupAddDTO.description);
	}

	@Post('/groups/edit')
	public async editGroup(@Body() groupEditDTO: GroupEditDTO) {
		return await this.groups.editGroup(groupEditDTO.id, groupEditDTO.group, groupEditDTO.description);
	}

	@Post('/groups/remove')
	public async removeGroup(@Body() idDTO: IdDTO) {
		return await this.groups.removeGroup(idDTO.id);
	}

	@Post('/groups/restore')
	public async restoreGroup(@Body() idDTO: IdDTO) {
		return await this.groups.restoreGroup(idDTO.id);
	}

	@Post('/groups/delete')
	public async deleteGroup(@Body() idDTO: IdDTO) {
		return await this.groups.deleteGroup(idDTO.id);
	}

	@Get('/groups-short')
	public async getShortGroups() {
		return await this.groups.getShortGroupAll();
	}

	protected shortTitlesCount: number = 150;

	// titles
	@Get('/titles')
	public async getTitles(@Query() pageDTO: PageDTO) {
		return await this.titles.getTitleAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/titles/add')
	public async addTitle(@Body() titleAddDTO: TitleAddDTO) {
		return await this.titles.createTitle(titleAddDTO.title, titleAddDTO.description);
	}

	@Post('/titles/edit')
	public async editTitle(@Body() titleEditDTO: TitleEditDTO) {
		return await this.titles.editTitle(titleEditDTO.id, titleEditDTO.title, titleEditDTO.description);
	}

	@Post('/titles/remove')
	public async removeTitle(@Body() idDTO: IdDTO) {
		return await this.titles.removeTitle(idDTO.id);
	}

	@Post('/titles/restore')
	public async restoreTitle(@Body() idDTO: IdDTO) {
		return await this.titles.restoreTitle(idDTO.id);
	}

	@Post('/titles/delete')
	public async deleteTitle(@Body() idDTO: IdDTO) {
		return await this.titles.deleteTitle(idDTO.id);
	}

	@Get('/title-groups')
	public async getTitleGroupAll(@Query() pageDTO: PageDTO) {
		return await this.titles.getTitleGroupAll(this.countRows, (pageDTO.page-1)*this.countRows);
	}

	@Get('/titles-short')
	public async getShortTitles(@Query() pageDTO: PageDTO) {
		return await this.titles.getShortTitleAll(this.shortTitlesCount, (pageDTO.page-1)*this.shortTitlesCount);
	}


	// reviews
	@Get('/reviews')
	public async getReviews(@Query() pageDTO: PageDTO) {
		return await this.reviews.getReviewAll({withDeleted: true, limit: this.countRows, offset: (pageDTO.page-1)*this.countRows});
	}

	@Get('/review-full')
	public async getReview(@Query() reviewIdDTO: ReviewIdDTO) {
		return await this.reviews.getReviewOne({withDeleted: true, ...reviewIdDTO});
	}

	@Get('/reviews-short')
	public async getShortReviews() {
		return await this.reviews.getShortReviewAll();
	}

	@Post('/reviews/add')
	public async addReview(@Body() reviewAddDTO: ReviewAddDTO) {
		return await this.searchReview.createReviewWithIndexing(reviewAddDTO);
	}

	@Post('/reviews/edit')
	public async editReview(@Body() reviewEditDTO: ReviewEditDTO) {
		return await this.searchReview.updateReviewWithIndexing({...reviewEditDTO, superEdit: true});
	}

	@Post('/reviews/remove')
	public async removeReview(@Body() idDTO: IdDTO) {
		//return await this.reviews.removeReview(id);
		return await this.searchReview.removeReviewWithDeleteIndex({...idDTO, superEdit: true});
	}

	@Post('/reviews/restore')
	public async restoreReview(@Body() idDTO: IdDTO) {
		//return await this.reviews.restoreReview(id);
		return await this.searchReview.restoreReviewWithDeleteIndex({...idDTO, superEdit: true});
	}

	@Post('/reviews/delete')
	public async deleteReview(@Body() idDTO: IdDTO) {
		//return await this.reviews.deleteReview(id);
		return await this.searchReview.deleteReviewWithDeleteIndex({...idDTO, superEdit: true});
	}

	@Get('/review-tags')
	public async getReviewTagAll(@Query() pageDTO: PageDTO) {
		return await this.reviews.getReviewTagAll(this.countRows, (pageDTO.page-1)*this.countRows);
	}


	// images
	@Get('/images')
	public async getImages(@Query() pageDTO: PageDTO) {// this.countRows, (page-1)*this.countRows, true
		return await this.images.getImageAll({withDeleted: true, limit: this.countRows, offset: (pageDTO.page-1)*this.countRows});
	}

	@Post('/images/add')
	@UseInterceptors(FilesInterceptor('images[]', 3, {
		limits: {
			fileSize: 3*1024*1024
		},
		fileFilter: (req: any, file: any, callback: Function) => {
			// originalname
			if(file.originalname.length > 100) callback(new ConflictException('Origin filename must been not more than 100 characters'))
			// mimetype
			if(!/^image\//i.test(file.mimetype)) callback(new ConflictException('Invalid mime file type'))

			callback(null, true);
		}
	}))
	public async addImage(@Body() imageAddDTO: ImageAddDTO, @UploadedFiles() images: Array<Express.Multer.File>) {
		return await this.images.createImage({...imageAddDTO, images});
	}

	@Post('/images/edit')
	public async editImage(@Body() imageEditDTO: ImageEditDTO) {
		return await this.images.editImage({...imageEditDTO, superEdit: true});
	}

	@Post('/images/remove')
	public async removeImage(@Body() idDTO: IdDTO) {
		return await this.images.removeImage({...idDTO, superEdit: true});
	}

	@Post('/images/restore')
	public async restoreImage(@Body() idDTO: IdDTO) {
		return await this.images.restoreImage({...idDTO, superEdit: true});
	}

	@Post('/images/delete')
	public async deleteImage(@Body() idDTO: IdDTO) {
		return await this.images.deleteImage({...idDTO, superEdit: true});
	}



	// tags
	@Get('/tags')
	public async getTags(@Query() pageDTO: PageDTO) {
		return await this.tags.getTagAll({withDeleted: true, limit: this.countRows, offset: (pageDTO.page-1)*this.countRows});
	}

	@Post('/tags/add')
	public async addTag(@Body() tagAddDTO: TagAddDTO) {
		return await this.tags.createTag(tagAddDTO.tag);
	}

	@Post('/tags/edit')
	public async editTag(@Body() tagEditDTO: TagEditDTO) {
		return await this.tags.editTag(tagEditDTO.id, tagEditDTO.tag);
	}

	@Post('/tags/remove')
	public async removeTag(@Body() idDTO: IdDTO) {
		return await this.tags.removeTag(idDTO.id);
	}

	@Post('/tags/restore')
	public async restoreTag(@Body() idDTO: IdDTO) {
		return await this.tags.restoreTag(idDTO.id);
	}

	@Post('/tags/delete')
	public async deleteTag(@Body() idDTO: IdDTO) {
		return await this.tags.deleteTag(idDTO.id);
	}

	@Get('/tags-short')
	public async getShortTags() {
		return await this.tags.getShortTagAll();
	}

	// ratings
	@Get('/ratings')
	public async getRatings(@Query() pageDTO: PageDTO) {
		return await this.ratings.getRatingAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/ratings/add')
	public async addRating(@Body() ratingAddDTO: RatingAddDTO) {
		return await this.ratings.createRating(ratingAddDTO);
	}

	@Post('/ratings/edit')
	public async editRating(@Body() ratingEditDTO: RatingEditDTO) {
		return await this.ratings.editRating({...ratingEditDTO, superEdit: true});
	}

	@Post('/ratings/remove')
	public async removeRating(@Body() idDTO: IdDTO) {
		return await this.ratings.removeRating({...idDTO, superEdit: true});
	}

	@Post('/ratings/restore')
	public async restoreRating(@Body() idDTO: IdDTO) {
		return await this.ratings.restoreRating({...idDTO, superEdit: true});
	}

	@Post('/ratings/delete')
	public async deleteRating(@Body() idDTO: IdDTO) {
		return await this.ratings.deleteRating({...idDTO, superEdit: true});
	}



	// likes
	@Get('/likes')
	public async getLikes(@Query() pageDTO: PageDTO) {
		return await this.likes.getLikeAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/likes/add')
	public async addLike(@Body() likeAddDTO: LikeAddDTO) {
		return await this.likes.createLike(likeAddDTO);
	}

	@Post('/likes/edit')
	public async editLike(@Body() likeEditDTO: LikeEditDTO) {
		return await this.likes.editLike({...likeEditDTO, superEdit: true});
	}

	@Post('/likes/remove')
	public async removeLike(@Body() idDTO: IdDTO) {
		return await this.likes.removeLike({...idDTO, superEdit: true});
	}

	@Post('/likes/restore')
	public async restoreLike(@Body() idDTO: IdDTO) {
		return await this.likes.restoreLike({...idDTO, superEdit: true});
	}

	@Post('/likes/delete')
	public async deleteLike(@Body() idDTO: IdDTO) {
		return await this.likes.deleteLike({...idDTO, superEdit: true});
	}


	// comments
	@Get('/comments')
	public async getComments(@Query() pageDTO: PageDTO) {
		return await this.comments.getCommentAll(this.countRows, (pageDTO.page-1)*this.countRows, true);
	}

	@Post('/comments/add')
	public async addComment(@Body() commentAddDTO: CommentAddDTO) {
		//return await this.comments.createComment(reviewId, userId, comment, draft, blocked);
		return await this.searchComment.createCommentWithIndexing(commentAddDTO);
	}

	@Post('/comments/edit')
	public async editComment(@Body() commentEditDTO: CommentEditDTO) {
		//return await this.comments.editComment(id, reviewId, userId, comment, draft, blocked);
		return await this.searchComment.updateCommentWithIndexing({...commentEditDTO, superEdit: true});
	}

	@Post('/comments/remove')
	public async removeComment(@Body() idDTO: IdDTO) {
		return await this.searchComment.removeCommentWithIndexing({...idDTO, superEdit: true});
	}

	@Post('/comments/restore')
	public async restoreComment(@Body() idDTO: IdDTO) {
		return await this.searchComment.restoreCommentWithIndexing({...idDTO, superEdit: true});
	}

	@Post('/comments/delete')
	public async deleteComment(@Body() idDTO: IdDTO) {
		//return await this.comments.deleteComment(id);
		return await this.searchComment.deleteCommentWithIndexing({...idDTO, superEdit: true});
	}
}
