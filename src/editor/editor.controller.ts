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
import {JWTIsRefreshAuthGuard} from '../auth/guards/jwt.is.refresh.auth.guard';
import {EditorRoleGuard} from '../auth/guards/editor.role.guard';

@UseGuards(EditorRoleGuard)
@UseGuards(JWTAccessAuthGuard)
@Controller('/editor')
export class EditorController {
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

	protected countRows: number = 20;

	@Get('/reviews')
	public async getReviewAll(@Request() req, @Query('page') page: number = 1,
								@Query('tags') tags: number[], @Query('titles') titles: number[], @Query('groups') groups: number[],
								@Query('sortField') sortField: string, @Query('sortType') sortType: "ASC"|"DESC") {
		return await this.reviews.getReviewAll({
			condUserId: req.user.id, limit: this.countRows, offset: (page-1)*this.countRows,
			withTags: tags, withTitles: titles, withGroups: groups,
			sortField: sortField, sortType: sortType
		});
	}

	@Get('/review/:id')
	public async getFullReview(@Request() req, @Param('id') id: number) {
		return await this.reviews.getReviewOne({reviewId: id, condUserId: req.user.id});
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/review-new')
	public async newReview(@Request() req) {
		throw new Error('NOT IMPLEMENTED REVIEW NEW');
		//return await this.reviews.createReview('', '', 0, req.user.id, 0, 0, true, [], false/* is blocked false*/, true);
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/review-edit')
	public async editReview(@Request() req, @Body('id') id: number, @Body('description') description: string, @Body('text') text: string, @Body('authorRating') authorRating: number, @Body('titleId') titleId: number, @Body('groupId') groupId: number, @Body('draft') draft: boolean, @Body('tags') tags: number[]) {
		//return await this.reviews.editReview(id, description, text, authorRating, req.user.id, titleId, groupId, draft, tags, false/* is blocked false*/);
		//return await this.reviews.editReview({id, description, text, authorRating, userId: req.user.id, titleId, groupId, draft, tags, blocked: false});
		throw new Error('NOT IMPLEMENTED REVIEW EDIT');
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/review-remove')
	public async removeReview(@Request() req, @Body('id') id: number) {
		//return await this.reviews.removeReview(id);
		throw new Error('NOT IMPLEMENTED REVIEW REMOVE');
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/title-new')
	public async newTitle(@Body('title') title: string, @Body('description') description: string) {
		return await this.titles.createTitle(title, description);
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/tag-new')
	public async newTag(@Body('tag') tag: string) {
		return await this.tags.createTag(tag);
	}

	protected countImageRows: number = 20;

	@Get('/images')
	public async getImageAll(@Query('page') page: number = 1) {
		return await this.images.getImageAll(this.countImageRows, (page-1)*this.countImageRows, false);
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/image-new')
	@UseInterceptors(FilesInterceptor('images[]', 1))
	public async newImage(@Request() req, @UploadedFiles() images: Array<Express.Multer.File>) {
		return await this.images.createImage(req.user.id, images);
	}
}
