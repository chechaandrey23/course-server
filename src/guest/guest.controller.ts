import {Body, Controller, Get, Post, Param, Query, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe, UsePipes} from '@nestjs/common';
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

// dto
import {IdDTO} from '../dto/id.dto';
import {PageDTO} from '../dto/page.dto';
import {ReviewsFilterExtDTO} from '../dto/reviews.filter.ext.dto';
import {SearchDTO} from '../dto/search.dto';
import {TitlesQueryDTO} from '../dto/titles.query.dto';
import {TagsQueryDTO} from '../dto/tags.query.dto';
import {GroupTitleIdDTO} from '../dto/grouptitleid.dto';
import {TagsOrderDTO} from '../dto/tags.order.dto';

@UsePipes(new ValidationPipe({transform: true}))
@Controller('/guest')
export class GuestController {
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
		private searchReview: SearchReviewService
	) {}

	protected readonly countRows: number = 10;
	protected readonly countTags: number = 25;

	@Get('/reviews')
	public async getDescriptionOrderReviews(@Query() reviewsFilterExtDTO: ReviewsFilterExtDTO) {
		return await this.reviews.getReviewAll({
			condPublic: true, condBlocked: false, limit: this.countRows, offset: (reviewsFilterExtDTO.page-1)*this.countRows,
			withTags: reviewsFilterExtDTO.tags, withTitles: reviewsFilterExtDTO.titles,
			withGroups: reviewsFilterExtDTO.groups, withAuthors: reviewsFilterExtDTO.authors,
			sortField: reviewsFilterExtDTO.sortField, sortType: reviewsFilterExtDTO.sortType
		});
	}

	@Get('/review/:id')
	public async getFullReview(@Param() idDTO: IdDTO) {
		return await this.reviews.getReviewOne({reviewId: idDTO.id, condPublic: true, condBlocked: false});
	}

	@Get('/other-short-reviews/:groupTitleId')
	public async getShortOtherReviews(@Param() groupTitleIdDTO: GroupTitleIdDTO) {
		return await this.reviews.getShortOtherReviewAll(groupTitleIdDTO.groupTitleId);
	}

	@Get(['/tags', '/tags/order-:order'])
	public async getTagOrderReviews(@Query() pageDTO: PageDTO, @Param() tagsOrderDTO: TagsOrderDTO) {
		return await this.tags.getTagAll({limit: this.countTags, offset: (pageDTO.page-1)*this.countTags, ...tagsOrderDTO});
	}

	protected countEditorRows: number = 20;

	@Get('/editor-short-part')
	public async getShortEditorUsers(@Query() pageDTO: PageDTO) {
		return await this.users.getShortEditorUserAll(this.countEditorRows, (pageDTO.page-1)*this.countEditorRows);
	}

	@Get('/groups')
	public async getGroupAll() {
		return await this.groups.getShortGroupAll();
	}

	@Get('/part-titles/:query')
	public async getTitlePart(@Param() titlesQueryDTO: TitlesQueryDTO) {
		return await this.titles.getPartTitleAll(this.countRows, 0, titlesQueryDTO.query);
	}

	@Get('/part-tags/:query')
	public async getTagPart(@Param() tagsQueryDTO: TagsQueryDTO) {
		return await this.tags.getPartTagAll(this.countRows, 0, tagsQueryDTO.query);
	}

	@Get('/search/:query')
	public async getReviewSearchAll(@Param() searchDTO: SearchDTO, @Query() pageDTO: PageDTO) {
		return await this.searchReview.getSearchAll(searchDTO.query, {
			limit: this.countRows, offset: (pageDTO.page-1)*this.countRows, condPublic: true, blocked: false
		});
	}
}
