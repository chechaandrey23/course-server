import {Body, Controller, Get, Post, Param, Query, UploadedFile, UploadedFiles, UseInterceptors, Request, UseGuards, ValidationPipe, UsePipes} from '@nestjs/common';
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

import {SearchReviewService} from '../entries/reviews/search.review.service';
import {SearchCommentService} from '../entries/comments/search.comment.service';

import {JWTAccessAuthGuard} from '../auth/guards/jwt.access.auth.guard';

import {UserRoleGuard} from '../auth/guards/user.role.guard';

// dtos
import {IdDTO} from '../dto/id.dto';
import {PageDTO} from '../dto/page.dto';
import {ReviewsFilterExtDTO} from '../dto/reviews.filter.ext.dto';
import {UserInfoEditWithoutDTO} from '../dto/userinfo.edit.without.dto';
import {RatingAddWithoutDTO} from '../dto/rating.add.without.dto';
import {LikeAddWithoutDTO} from '../dto/like.add.without.dto';
import {ReviewIdDTO} from '../dto/reviewid.dto';
import {SearchDTO} from '../dto/search.dto';
import {CommentsDTO} from '../dto/comments.dto';
import {CommentsAutoUpdateDTO} from '../dto/comments.autoupdate.dto';
import {CommentAddWithoutDTO} from '../dto/comment.add.without.dto';
import {CommentEditWithoutDTO} from '../dto/comment.edit.without.dto';

@UseGuards(UserRoleGuard)
@UseGuards(JWTAccessAuthGuard)
@UsePipes(new ValidationPipe({transform: true}))
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
		private comments: CommentsService,
		private searchReview: SearchReviewService,
		private searchComment: SearchCommentService
	) {}

	protected readonly countRows: number = 10;

	@Get('/reviews')
	public async getDescriptionOrderReviews(@Request() req, @Query() reviewsFilterExtDTO: ReviewsFilterExtDTO) {
		return await this.reviews.getReviewAll({
			condPublic: true, condBlocked: false, limit: this.countRows, offset: (reviewsFilterExtDTO.page-1)*this.countRows,
			withTags: reviewsFilterExtDTO.tags, withTitles: reviewsFilterExtDTO.titles,
			withGroups: reviewsFilterExtDTO.groups, withAuthors: reviewsFilterExtDTO.authors,
			sortField: reviewsFilterExtDTO.sortField, sortType: reviewsFilterExtDTO.sortType,
			forUserId: req.user.id
		});
	}

	@Get('/review/:id')
	public async getFullReview(@Request() req, @Param() idDTO: IdDTO) {
		return await this.reviews.getReviewOne({reviewId: idDTO.id, forUserId: req.user.id, condPublic: true, condBlocked: false});
	}

	@Get('/user')
	public async getUserObject(@Request() req) {
		return await this.users.getUserOne(req.user.id);
	}

	@Post('/user-settings')
	public async setUserSettings(@Request() req, @Body() userInfoEditWithoutDTO: UserInfoEditWithoutDTO) {
		return await this.userInfos.editUserInfo({userId: req.user.id, ...userInfoEditWithoutDTO});
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
	public async serUserRating(@Request() req, @Body() ratingAddWithoutDTO: RatingAddWithoutDTO) {
		return await this.ratings.createRating({...ratingAddWithoutDTO, userId: req.user.id});
	}

	@Post('/like-new')
	public async serUserLike(@Request() req, @Body() likeAddWithoutDTO: LikeAddWithoutDTO) {
		return await this.likes.createLike({...likeAddWithoutDTO, userId: req.user.id, like: true});
	}

	// comments
	@Get('/comments')
	public async getComments(@Request() req, @Query() commentsDTO: CommentsDTO) {
		return await this.comments.getCommentReviewAll(this.countRows, (commentsDTO.page-1)*this.countRows, commentsDTO.reviewId, true, false);
	}

	@Get('/auto-update-comments')
	public async autoUpdateComments(@Request() req, @Query() commentsAutoUpdateDTO: CommentsAutoUpdateDTO) {
		return await this.comments.getAutoUpdateCommentAll(commentsAutoUpdateDTO.time, commentsAutoUpdateDTO.reviewId, true, false);
	}

	@Post('/new-comment')
	public async newComment(@Request() req, @Body() commentAddWithoutDTO: CommentAddWithoutDTO) {
		return await this.searchComment.createCommentWithIndexing({...commentAddWithoutDTO, userId: req.user.id, draft: false, blocked: false});
	}

	@Post('/edit-comment')
	public async editComment(@Request() req, @Body() commentEditWithoutDTO: CommentEditWithoutDTO) {
		//return await this.searchComment.createCommentWithIndexing({reviewId, userId: req.user.id, comment, draft: false, blocked: false});
		return await this.searchComment.updateCommentWithIndexing({...commentEditWithoutDTO, userId: req.user.id, draft: false});
	}

	@Post('/remove-comment')
	public async removeComment(@Request() req, @Body() idDTO: IdDTO) {
		//return await this.searchComment.createCommentWithIndexing({reviewId, userId: req.user.id, comment, draft: false, blocked: false});
		return await this.searchComment.removeCommentWithIndexing({...idDTO, userId: req.user.id});
	}

	@Get('/search/:query')
	public async getReviewSearchAll(@Request() req, @Param() searchDTO: SearchDTO, @Query() pageDTO: PageDTO) {
		return await this.searchReview.getSearchAll(searchDTO.query, {
			limit: this.countRows, offset: (pageDTO.page-1)*this.countRows, condPublic: true, blocked: false, forUserId: req.user.id
		});
	}
}
