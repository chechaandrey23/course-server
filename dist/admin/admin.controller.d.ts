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
import { SearchReviewService } from '../entries/reviews/search.review.service';
import { SearchCommentService } from '../entries/comments/search.comment.service';
import { IdDTO } from '../dto/id.dto';
import { PageDTO } from '../dto/page.dto';
import { ReviewIdDTO } from '../dto/reviewid.dto';
import { ReviewSearchIdDTO } from '../dto/reviewsearchid.dto';
import { CommentAddDTO } from '../dto/comment.add.dto';
import { CommentEditDTO } from '../dto/comment.edit.dto';
import { GroupAddDTO } from '../dto/group.add.dto';
import { GroupEditDTO } from '../dto/group.edit.dto';
import { ImageAddDTO } from '../dto/image.add.dto';
import { ImageEditDTO } from '../dto/image.edit.dto';
import { LangAddDTO } from '../dto/lang.add.dto';
import { LangEditDTO } from '../dto/lang.edit.dto';
import { LikeAddDTO } from '../dto/like.add.dto';
import { LikeEditDTO } from '../dto/like.edit.dto';
import { RatingAddDTO } from '../dto/rating.add.dto';
import { RatingEditDTO } from '../dto/rating.edit.dto';
import { ReviewAddDTO } from '../dto/review.add.dto';
import { ReviewEditDTO } from '../dto/review.edit.dto';
import { RoleAddDTO } from '../dto/role.add.dto';
import { RoleEditDTO } from '../dto/role.edit.dto';
import { TagAddDTO } from '../dto/tag.add.dto';
import { TagEditDTO } from '../dto/tag.edit.dto';
import { ThemeAddDTO } from '../dto/theme.add.dto';
import { ThemeEditDTO } from '../dto/theme.edit.dto';
import { TitleAddDTO } from '../dto/title.add.dto';
import { TitleEditDTO } from '../dto/title.edit.dto';
import { UserAddDTO } from '../dto/user.add.dto';
import { UserEditDTO } from '../dto/user.edit.dto';
import { UserSocialAddDTO } from '../dto/user.social.add.dto';
import { UserInfoAddDTO } from '../dto/userinfo.add.dto';
import { UserInfoEditDTO } from '../dto/userinfo.edit.dto';
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
    private searchReview;
    private searchComment;
    constructor(users: UsersService, roles: RolesService, langs: LangsService, themes: ThemesService, userInfos: UserInfosService, groups: GroupsService, titles: TitlesService, reviews: ReviewsService, images: ImagesService, tags: TagsService, ratings: RatingsService, likes: LikesService, comments: CommentsService, refreshTokens: RefreshTokenService, searchReview: SearchReviewService, searchComment: SearchCommentService);
    protected readonly countRows: number;
    getRefreshTokens(pageDTO: PageDTO): Promise<import("../entries/refreshtoken/refresh.token.model").RefreshToken[]>;
    deleteRefreshToken(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    eraseRefreshToken(idDTO: IdDTO): Promise<{
        id: number;
        dateEndRT1: any;
    }>;
    getReviewForSearchAll(pageDTO: PageDTO): Promise<import("../entries/reviews/review.model").Review[]>;
    getReviewIndexElasticSearch(reviewSearchIdDTO: ReviewSearchIdDTO): Promise<{
        review: import("../entries/reviews/review.model").Review;
        index: import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>;
    }>;
    indexReviewElasticSearch(reviewIdDTO: ReviewIdDTO): Promise<{
        id: number;
        searchId: any;
    }>;
    deleteIndexReviewElasticSearch(reviewSearchIdDTO: ReviewSearchIdDTO): Promise<{
        id: number;
        searchId: any;
    }>;
    getUsers(pageDTO: PageDTO): Promise<import("../entries/users/user.model").User[]>;
    addUser(userAddDTO: UserAddDTO): Promise<any>;
    addSocialUser(userSocialAddDTO: UserSocialAddDTO): Promise<any>;
    editUserAdmin(userEditDTO: UserEditDTO): Promise<import("../entries/users/user.model").User>;
    removeUser(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreUser(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteUser(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    protected shortUsersCount: number;
    getShortUsers(pageDTO: PageDTO): Promise<import("../entries/users/user.model").User[]>;
    getShortEditorUsers(pageDTO: PageDTO): Promise<import("../entries/users/user.model").User[]>;
    getShortUserUsers(pageDTO: PageDTO): Promise<import("../entries/users/user.model").User[]>;
    getUserRoleAll(pageDTO: PageDTO): Promise<import("../entries/users/user.roles.model").UserRoles[]>;
    getUserInfos(pageDTO: PageDTO): Promise<import("../entries/userinfos/userinfo.model").UserInfo[]>;
    addUserInfo(userInfoAddDTO: UserInfoAddDTO): Promise<import("../entries/userinfos/userinfo.model").UserInfo>;
    editUserInfo(userInfoEditDTO: UserInfoEditDTO): Promise<import("../entries/userinfos/userinfo.model").UserInfo>;
    removeUserInfo(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreUserInfo(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteUserInfo(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getRoles(pageDTO: PageDTO): Promise<import("../entries/roles/role.model").Role[]>;
    addRole(roleAddDTO: RoleAddDTO): Promise<import("../entries/roles/role.model").Role>;
    editRole(roleEditDTO: RoleEditDTO): Promise<import("../entries/roles/role.model").Role>;
    removeRole(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreRole(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteRole(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getShortRoles(): Promise<import("../entries/roles/role.model").Role[]>;
    getLangs(pageDTO: PageDTO): Promise<import("../entries/langs/lang.model").Lang[]>;
    addLang(langAddDTO: LangAddDTO): Promise<import("../entries/langs/lang.model").Lang>;
    editLang(langEditDTO: LangEditDTO): Promise<import("../entries/langs/lang.model").Lang>;
    removeLang(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreLang(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteLang(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getShortLangs(): Promise<import("../entries/langs/lang.model").Lang[]>;
    getThemes(pageDTO: PageDTO): Promise<import("../entries/themes/theme.model").Theme[]>;
    addTheme(themeAddDTO: ThemeAddDTO): Promise<import("../entries/themes/theme.model").Theme>;
    editTheme(themeEditDTO: ThemeEditDTO): Promise<import("../entries/themes/theme.model").Theme>;
    removeTheme(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTheme(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTheme(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getShortThemes(): Promise<import("../entries/themes/theme.model").Theme[]>;
    getGroups(pageDTO: PageDTO): Promise<import("../entries/groups/group.model").Group[]>;
    addGroup(groupAddDTO: GroupAddDTO): Promise<import("../entries/groups/group.model").Group>;
    editGroup(groupEditDTO: GroupEditDTO): Promise<import("../entries/groups/group.model").Group>;
    removeGroup(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreGroup(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteGroup(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getShortGroups(): Promise<import("../entries/groups/group.model").Group[]>;
    protected shortTitlesCount: number;
    getTitles(pageDTO: PageDTO): Promise<import("../entries/titles/title.model").Title[]>;
    addTitle(titleAddDTO: TitleAddDTO): Promise<import("../entries/titles/title.model").Title>;
    editTitle(titleEditDTO: TitleEditDTO): Promise<import("../entries/titles/title.model").Title>;
    removeTitle(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTitle(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTitle(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getTitleGroupAll(pageDTO: PageDTO): Promise<import("../entries/titles/title.groups.model").TitleGroups[]>;
    getShortTitles(pageDTO: PageDTO): Promise<import("../entries/titles/title.model").Title[]>;
    getReviews(pageDTO: PageDTO): Promise<import("../entries/reviews/review.model").Review[]>;
    getReview(reviewIdDTO: ReviewIdDTO): Promise<import("../entries/reviews/review.model").Review>;
    getShortReviews(): Promise<import("../entries/reviews/review.model").Review[]>;
    addReview(reviewAddDTO: ReviewAddDTO): Promise<any>;
    editReview(reviewEditDTO: ReviewEditDTO): Promise<any>;
    removeReview(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreReview(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteReview(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getReviewTagAll(pageDTO: PageDTO): Promise<import("../entries/reviews/review.tags.model").ReviewTags[]>;
    getImages(pageDTO: PageDTO): Promise<import("../entries/images/image.model").Image[]>;
    addImage(imageAddDTO: ImageAddDTO, images: Array<Express.Multer.File>): Promise<import("../entries/images/image.model").Image[]>;
    editImage(imageEditDTO: ImageEditDTO): Promise<import("../entries/images/image.model").Image[]>;
    removeImage(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreImage(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteImage(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getTags(pageDTO: PageDTO): Promise<import("../entries/tags/tag.model").Tag[]>;
    addTag(tagAddDTO: TagAddDTO): Promise<import("../entries/tags/tag.model").Tag>;
    editTag(tagEditDTO: TagEditDTO): Promise<import("../entries/tags/tag.model").Tag>;
    removeTag(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTag(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTag(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getShortTags(): Promise<import("../entries/tags/tag.model").Tag[]>;
    getRatings(pageDTO: PageDTO): Promise<import("../entries/ratings/rating.model").Rating[]>;
    addRating(ratingAddDTO: RatingAddDTO): Promise<import("../entries/ratings/rating.model").Rating>;
    editRating(ratingEditDTO: RatingEditDTO): Promise<import("../entries/ratings/rating.model").Rating>;
    removeRating(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreRating(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteRating(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getLikes(pageDTO: PageDTO): Promise<import("../entries/likes/like.model").Like[]>;
    addLike(likeAddDTO: LikeAddDTO): Promise<import("../entries/likes/like.model").Like>;
    editLike(likeEditDTO: LikeEditDTO): Promise<import("../entries/likes/like.model").Like>;
    removeLike(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreLike(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteLike(idDTO: IdDTO): Promise<{
        id: number;
    }>;
    getComments(pageDTO: PageDTO): Promise<import("../entries/comments/comment.model").Comment[]>;
    addComment(commentAddDTO: CommentAddDTO): Promise<any>;
    editComment(commentEditDTO: CommentEditDTO): Promise<any>;
    removeComment(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreComment(idDTO: IdDTO): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteComment(idDTO: IdDTO): Promise<{
        id: number;
    }>;
}
