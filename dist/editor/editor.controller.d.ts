/// <reference types="multer" />
import { UsersService } from '../entries/users/users.service';
import { RolesService } from '../entries/roles/roles.service';
import { ThemesService } from '../entries/themes/themes.service';
import { LangsService } from '../entries/langs/langs.service';
import { UserInfosService } from '../entries/userinfos/userinfos.service';
import { GroupsService } from '../entries/groups/groups.service';
import { TitlesService } from '../entries/titles/titles.service';
import { ReviewsService } from '../entries/reviews/reviews.service';
import { ImagesService } from '../entries/images/images.service';
import { TagsService } from '../entries/tags/tags.service';
import { RatingsService } from '../entries/ratings/ratings.service';
import { LikesService } from '../entries/likes/likes.service';
import { CommentsService } from '../entries/comments/comments.service';
export declare class EditorController {
    private users;
    private roles;
    private langs;
    private themes;
    private userInfos;
    private groups;
    private titles;
    private reviews;
    private images;
    private tags;
    private ratings;
    private likes;
    private comments;
    constructor(users: UsersService, roles: RolesService, langs: LangsService, themes: ThemesService, userInfos: UserInfosService, groups: GroupsService, titles: TitlesService, reviews: ReviewsService, images: ImagesService, tags: TagsService, ratings: RatingsService, likes: LikesService, comments: CommentsService);
    protected countRows: number;
    getReviewAll(req: any, page: number, tags: number[], titles: number[], groups: number[], sortField: string, sortType: "ASC" | "DESC"): Promise<import("../entries/reviews/review.model").Review[]>;
    getFullReview(req: any, id: number): Promise<import("../entries/reviews/review.model").Review>;
    newReview(req: any): Promise<import("../entries/reviews/review.model").Review>;
    editReview(req: any, id: number, description: string, text: string, authorRating: number, titleId: number, groupId: number, draft: boolean, tags: number[]): Promise<import("../entries/reviews/review.model").Review>;
    removeReview(req: any, id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    newTitle(title: string, description: string): Promise<import("../entries/titles/title.model").Title>;
    newTag(tag: string): Promise<import("../entries/tags/tag.model").Tag>;
    protected countImageRows: number;
    getImageAll(page?: number): Promise<import("../entries/images/image.model").Image[]>;
    newImage(req: any, images: Array<Express.Multer.File>): Promise<import("../entries/images/image.model").Image[]>;
}
