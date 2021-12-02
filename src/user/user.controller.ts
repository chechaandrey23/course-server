import {Body, Controller, Get, Post, Param, Query, UploadedFile, UploadedFiles, UseInterceptors, Request, UseGuards} from '@nestjs/common';
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

import {JWTAccessAuthGuard} from '../auth/guards/jwt.access.auth.guard';

import {UserRoleGuard} from '../auth/guards/user.role.guard';

@UseGuards(UserRoleGuard)
@UseGuards(JWTAccessAuthGuard)
@Controller('/user')
export class UserController {
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

	protected readonly countRows: number = 10;

	@Get(['/reviews'])
	public async getDescriptionOrderReviews(@Request() req, @Query('page') page: number = 1,
											@Query('tags') tags: number[], @Query('titles') titles: number[],
											@Query('groups') groups: number[], @Query('authors') authors: number[],
											@Query('sortField') sortField: string, @Query('sortType') sortType: "ASC"|"DESC") {
		return await this.reviews.getReviewAll({
			condPublic: true, limit: this.countRows, offset: (page-1)*this.countRows,
			withTags: tags, withTitles: titles, withGroups: groups, withAuthors: authors,
			sortField: sortField, sortType: sortType,
			forUserId: req.user.id
		});
	}

	@Get('/review/:id')
	public async getFullReview(@Request() req, @Param('id') id: number) {
		return await this.reviews.getReviewOne({reviewId: id, forUserId: req.user.id, condPublic: true});
	}

	@Get('/user')
	public async getUserObject(@Request() req) {
		return await this.users.getUserOne(req.user.id);
	}

	@Post('/user-settings')
	public async setUserSettings(@Body('id') id: number, @Body('first_name') first_name: string, @Body('last_name') last_name: string, @Body('themeId') themeId: number, @Body('langId') langId: number) {
		return await this.userInfos.editUserInfo(id, first_name, last_name, themeId, langId);
	}

	@Get('/langs')
	public async getUserLangAll() {
		return await this.langs.getShortLangAll();
	}

	@Get('/themes')
	public async getUserThemeAll() {
		return await this.themes.getShortThemeAll();
	}

	@Post('/rating-new')
	public async serUserRating(@Request() req, @Body('reviewId') reviewId: number, @Body('rating') rating: number) {
		return await this.ratings.createRating(reviewId, req.user.id, rating);
	}

	@Post('/like-new')
	public async serUserLike(@Request() req, @Body('reviewId') reviewId: number) {
		return await this.likes.createLike(reviewId, req.user.id, true);
	}

	// comments
	@Get('/comments')
	public async getComments(@Request() req, @Query('page') page: number = 1,  @Query('reviewId') reviewId) {
		return await this.comments.getCommentReviewAll(this.countRows, (page-1)*this.countRows, reviewId, true, false);
	}

	@Get('/auto-update-comments')
	public async autoUpdateComments(@Request() req, @Query('time') time: number,  @Query('reviewId') reviewId) {
		return await this.comments.getAutoUpdateCommentAll(time, reviewId, true, false);
	}

	@Post('/new-comment')
	public async newComment(@Request() req, @Body('reviewId') reviewId: number, @Body('comment') comment: string) {
		return await this.comments.createComment(reviewId, req.user.id, comment, false, false);
	}
}
