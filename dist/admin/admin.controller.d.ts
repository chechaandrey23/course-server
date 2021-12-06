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
import { RefreshTokenService } from '../entries/refreshtoken/refresh.token.service';
export declare class AdminController {
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
    private refreshTokens;
    constructor(users: UsersService, roles: RolesService, langs: LangsService, themes: ThemesService, userInfos: UserInfosService, groups: GroupsService, titles: TitlesService, reviews: ReviewsService, images: ImagesService, tags: TagsService, ratings: RatingsService, likes: LikesService, comments: CommentsService, refreshTokens: RefreshTokenService);
    protected readonly countRows: number;
    getRefreshTokens(page?: number): Promise<import("../entries/refreshtoken/refresh.token.model").RefreshToken[]>;
    deleteRefreshToken(id: number): Promise<{
        id: number;
    }>;
    getUsers(page?: number): Promise<import("../entries/users/user.model").User[]>;
    addUser(user: string, password: string, email: string, first_name: string, last_name: string): Promise<any>;
    addSocialUser(social_id: string, vendor: string, soft_create: boolean, displayName: string): Promise<any>;
    editUserAdmin(id: number, user: string, social_id: string, emial: string, blocked: boolean, activated: boolean, roles: number[]): Promise<import("../entries/users/user.model").User>;
    removeUser(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreUser(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteUser(id: number): Promise<{
        id: number;
    }>;
    protected shortUsersCount: number;
    getShortUsers(page?: number): Promise<import("../entries/users/user.model").User[]>;
    getShortEditorUsers(page?: number): Promise<import("../entries/users/user.model").User[]>;
    getShortUserUsers(page?: number): Promise<import("../entries/users/user.model").User[]>;
    getUserRoleAll(page?: number): Promise<import("../entries/users/user.roles.model").UserRoles[]>;
    getUserInfos(page?: number): Promise<import("../entries/userinfos/userinfo.model").UserInfo[]>;
    addUserInfo(userId: number): Promise<import("../entries/userinfos/userinfo.model").UserInfo>;
    editUserInfo(id: number, userId: number, first_name: string, last_name: string, themeId: number, langId: number): Promise<import("../entries/userinfos/userinfo.model").UserInfo>;
    removeUserInfo(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreUserInfo(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteUserInfo(id: number): Promise<{
        id: number;
    }>;
    getRoles(page?: number): Promise<import("../entries/roles/role.model").Role[]>;
    addRole(role: number, title: string, description: string): Promise<import("../entries/roles/role.model").Role>;
    editRole(id: number, role: number, title: string, description: string): Promise<import("../entries/roles/role.model").Role>;
    removeRole(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreRole(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteRole(id: number): Promise<{
        id: number;
    }>;
    getShortRoles(): Promise<import("../entries/roles/role.model").Role[]>;
    getLangs(page?: number): Promise<import("../entries/langs/lang.model").Lang[]>;
    addLang(lang: string, title: string, description: string): Promise<import("../entries/langs/lang.model").Lang>;
    editLang(id: number, lang: string, title: string, description: string): Promise<import("../entries/langs/lang.model").Lang>;
    removeLang(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreLang(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteLang(id: number): Promise<{
        id: number;
    }>;
    getShortLangs(): Promise<import("../entries/langs/lang.model").Lang[]>;
    getThemes(page?: number): Promise<import("../entries/themes/theme.model").Theme[]>;
    addTheme(theme: string, title: string, description: string): Promise<import("../entries/themes/theme.model").Theme>;
    editTheme(id: number, theme: string, title: string, description: string): Promise<import("../entries/themes/theme.model").Theme>;
    removeTheme(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTheme(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTheme(id: number): Promise<{
        id: number;
    }>;
    getShortThemes(): Promise<import("../entries/themes/theme.model").Theme[]>;
    getGroups(page?: number): Promise<import("../entries/groups/group.model").Group[]>;
    addGroup(group: string, description: string): Promise<import("../entries/groups/group.model").Group>;
    editGroup(id: number, group: string, description: string): Promise<import("../entries/groups/group.model").Group>;
    removeGroup(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreGroup(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteGroup(id: number): Promise<{
        id: number;
    }>;
    getShortGroups(): Promise<import("../entries/groups/group.model").Group[]>;
    getTitles(page?: number): Promise<import("../entries/titles/title.model").Title[]>;
    addTitle(title: string, description: string): Promise<import("../entries/titles/title.model").Title>;
    editTitle(id: number, title: string, description: string): Promise<import("../entries/titles/title.model").Title>;
    removeTitle(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTitle(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTitle(id: number): Promise<{
        id: number;
    }>;
    getTitleGroupAll(page?: number): Promise<import("../entries/titles/title.groups.model").TitleGroups[]>;
    getShortTitles(page?: number): Promise<import("../entries/titles/title.model").Title[]>;
    getReviews(page?: number): Promise<import("../entries/reviews/review.model").Review[]>;
    getReview(reviewId: any): Promise<import("../entries/reviews/review.model").Review>;
    getShortReviews(): Promise<import("../entries/reviews/review.model").Review[]>;
    addReview(description: string, text: string, authorRating: number, userId: number, titleId: number, groupId: number, draft: boolean, tags: number[], blocked: boolean): Promise<import("../entries/reviews/review.model").Review>;
    editReview(id: number, description: string, text: string, authorRating: number, userId: number, titleId: number, groupId: number, draft: boolean, tags: number[], blocked: boolean): Promise<import("../entries/reviews/review.model").Review>;
    removeReview(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreReview(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteReview(id: number): Promise<{
        id: number;
    }>;
    getReviewTagAll(page?: number): Promise<import("../entries/reviews/review.tags.model").ReviewTags[]>;
    getImages(page?: number): Promise<import("../entries/images/image.model").Image[]>;
    addImage(userId: number, images: Array<Express.Multer.File>): Promise<import("../entries/images/image.model").Image[]>;
    editImage(id: number, userId: number): Promise<import("../entries/images/image.model").Image[]>;
    removeImage(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreImage(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteImage(id: number): Promise<{
        id: number;
    }>;
    getTags(page?: number): Promise<import("../entries/tags/tag.model").Tag[]>;
    addTag(tag: string): Promise<import("../entries/tags/tag.model").Tag>;
    editTag(id: number, tag: string): Promise<import("../entries/tags/tag.model").Tag>;
    removeTag(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTag(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTag(id: number): Promise<{
        id: number;
    }>;
    getShortTags(): Promise<import("../entries/tags/tag.model").Tag[]>;
    getRatings(page?: number): Promise<import("../entries/ratings/rating.model").Rating[]>;
    addRating(reviewId: number, userId: number, rating: number): Promise<import("../entries/ratings/rating.model").Rating>;
    editRating(id: number, reviewId: number, userId: number, rating: number): Promise<import("../entries/ratings/rating.model").Rating>;
    removeRating(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreRating(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteRating(id: number): Promise<{
        id: number;
    }>;
    getLikes(page?: number): Promise<import("../entries/likes/like.model").Like[]>;
    addLike(reviewId: number, userId: number, like: boolean): Promise<import("../entries/likes/like.model").Like>;
    editLike(id: number, reviewId: number, userId: number, like: boolean): Promise<import("../entries/likes/like.model").Like>;
    removeLike(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreLike(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteLike(id: number): Promise<{
        id: number;
    }>;
    getComments(page?: number): Promise<import("../entries/comments/comment.model").Comment[]>;
    addComment(reviewId: number, userId: number, comment: string, draft: boolean, blocked: boolean): Promise<import("../entries/comments/comment.model").Comment>;
    editComment(id: number, reviewId: number, userId: number, comment: string, draft: boolean, blocked: boolean): Promise<import("../entries/comments/comment.model").Comment>;
    removeComment(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreComment(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteComment(id: number): Promise<{
        id: number;
    }>;
}
