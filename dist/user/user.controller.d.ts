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
import { SearchReviewService } from '../entries/reviews/search.review.service';
import { SearchCommentService } from '../entries/comments/search.comment.service';
export declare class UserController {
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
    private searchReview;
    private searchComment;
    constructor(users: UsersService, roles: RolesService, langs: LangsService, themes: ThemesService, userInfos: UserInfosService, groups: GroupsService, titles: TitlesService, reviews: ReviewsService, images: ImagesService, tags: TagsService, ratings: RatingsService, likes: LikesService, comments: CommentsService, searchReview: SearchReviewService, searchComment: SearchCommentService);
    protected readonly countRows: number;
    getDescriptionOrderReviews(req: any, page: number, tags: number[], titles: number[], groups: number[], authors: number[], sortField: string, sortType: "ASC" | "DESC"): Promise<import("../entries/reviews/review.model").Review[]>;
    getFullReview(req: any, id: number): Promise<import("../entries/reviews/review.model").Review>;
    getUserObject(req: any): Promise<import("../entries/users/user.model").User>;
    setUserSettings(req: any, id: number, first_name: string, last_name: string, themeId: number, langId: number): Promise<import("../entries/userinfos/userinfo.model").UserInfo>;
    getUserLangAll(): Promise<import("../entries/langs/lang.model").Lang[]>;
    getUserThemeAll(): Promise<import("../entries/themes/theme.model").Theme[]>;
    serUserRating(req: any, reviewId: number, rating: number): Promise<import("../entries/ratings/rating.model").Rating>;
    serUserLike(req: any, reviewId: number): Promise<import("../entries/likes/like.model").Like>;
    getComments(req: any, page: number, reviewId: any): Promise<import("../entries/comments/comment.model").Comment[]>;
    autoUpdateComments(req: any, time: number, reviewId: any): Promise<import("../entries/comments/comment.model").Comment[]>;
    newComment(req: any, reviewId: number, comment: string): Promise<any>;
    editComment(req: any, id: number, reviewId: number, comment: string): Promise<any>;
    removeComment(req: any, id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    getReviewSearchAll(query: string, page?: number): Promise<import("../entries/reviews/review.model").Review[]>;
}
