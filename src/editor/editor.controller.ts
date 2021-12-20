import {Body, Controller, Get, Post, Param, Query, UploadedFile, UploadedFiles, UseInterceptors, Request, UseGuards, ConflictException, ValidationPipe, UsePipes} from '@nestjs/common';
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

import {JWTAccessAuthGuard} from '../auth/guards/jwt.access.auth.guard';
import {JWTIsRefreshAuthGuard} from '../auth/guards/jwt.is.refresh.auth.guard';
import {EditorRoleGuard} from '../auth/guards/editor.role.guard';

// dtos
import {IdDTO} from '../dto/id.dto';
import {PageDTO} from '../dto/page.dto';
import {TitleAddDTO} from '../dto/title.add.dto';
import {TagAddDTO} from '../dto/tag.add.dto';
import {ReviewsFilterDTO} from '../dto/reviews.filter.dto';
import {ReviewAddWithoutDTO} from '../dto/review.add.without.dto';
import {ReviewEditWithoutDTO} from '../dto/review.edit.without.dto';

@UseGuards(EditorRoleGuard)
@UseGuards(JWTAccessAuthGuard)
@UsePipes(new ValidationPipe({transform: true}))
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
		private comments: CommentsService,
		private searchReview: SearchReviewService
	) {}

	protected countRows: number = 10;

	@Get('/reviews')
	public async getReviewAll(@Request() req, @Query() reviewsFilterDTO: ReviewsFilterDTO) {
		return await this.reviews.getReviewAll({
			condUserId: req.user.id, limit: this.countRows, offset: (reviewsFilterDTO.page-1)*this.countRows,
			withTags: reviewsFilterDTO.tags, withTitles: reviewsFilterDTO.titles, withGroups: reviewsFilterDTO.groups,
			sortField: reviewsFilterDTO.sortField, sortType: reviewsFilterDTO.sortType
		});
	}

	@Get('/review/:id')
	public async getFullReview(@Request() req, @Param() idDTO: IdDTO) {
		return await this.reviews.getReviewOne({reviewId: idDTO.id, condUserId: req.user.id});
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/review-new')
	public async newReview(@Request() req, @Body() reviewAddWithoutDTO: ReviewAddWithoutDTO) {
		return await this.searchReview.createReviewWithIndexing({...reviewAddWithoutDTO, userId: req.user.id, blocked: false});
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/review-edit')
	public async editReview(@Request() req, @Body() reviewEditWithoutDTO: ReviewEditWithoutDTO) {
		return await this.searchReview.updateReviewWithIndexing({...reviewEditWithoutDTO, userId: req.user.id});
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/review-remove')
	public async removeReview(@Request() req, @Body() idDTO: IdDTO) {
		return await this.searchReview.removeReviewWithDeleteIndex({...idDTO, userId: req.user.id});
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/title-new')
	public async newTitle(@Body() titleAddDTO: TitleAddDTO) {
		return await this.titles.createTitle(titleAddDTO.title, titleAddDTO.description);
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/tag-new')
	public async newTag(@Body() tagAddDTO: TagAddDTO) {
		return await this.tags.createTag(tagAddDTO.tag);
	}

	protected countImageRows: number = 20;

	@Get('/images')
	public async getImageAll(@Request() req, @Query() pageDTO: PageDTO) {
		return await this.images.getImageAll({limit: this.countImageRows, offset: (pageDTO.page-1)*this.countImageRows, condUserId: req.user.id});
		//return await this.images.getImageAll(this.countImageRows, (page-1)*this.countImageRows, false);
	}

	@UseGuards(JWTIsRefreshAuthGuard)
	@Post('/image-new')
	//@UseInterceptors(FilesInterceptor('images[]', 1))
	@UseInterceptors(FilesInterceptor('images[]', 1, {
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
	public async newImage(@Request() req, @UploadedFiles() images: Array<Express.Multer.File>) {
		return await this.images.createImage({userId: req.user.id, images});
	}
}
