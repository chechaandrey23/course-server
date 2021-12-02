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
		private comments: CommentsService
	) {}

	protected readonly countRows: number = 10;
	protected readonly countTags: number = 25;

	@Get(['/reviews'])
	public async getDescriptionOrderReviews(@Query('page') page: number = 1,
											@Query('tags') tags: number[], @Query('titles') titles: number[],
											@Query('groups') groups: number[], @Query('authors') authors: number[],
											@Query('sortField') sortField: string, @Query('sortType') sortType: "ASC"|"DESC") {
		return await this.reviews.getReviewAll({
			condPublic: true, limit: this.countRows, offset: (page-1)*this.countRows,
			withTags: tags, withTitles: titles, withGroups: groups, withAuthors: authors,
			sortField: sortField, sortType: sortType
		});
	}

	@Get('/review/:id')
	public async getFullReview(@Param('id') id: number) {
		return await this.reviews.getReviewOne({reviewId: id, condPublic: true});
	}

	@Get(['/tags', '/tags/order-:order'])
	public async getTagOrderReviews(@Query('page') page: number = 1, @Param('order') order: boolean = false) {
		return await this.tags.getTagAll({limit: this.countTags, offset: (page-1)*this.countTags, order: !!order});
	}

	protected countEditorRows: number = 20;

	@Get('/editor-short-part')
	public async getShortEditorUsers(@Query('page') page: number = 1) {
		return await this.users.getShortEditorUserAll(this.countEditorRows, (page-1)*this.countEditorRows);
	}
}
