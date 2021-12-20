import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Review } from './review.model';
import { ReviewTags } from './review.tags.model';
import { TitleGroups } from '../titles/title.groups.model';
import { Tag } from '../tags/tag.model';
export interface queryOptions {
    withDeleted?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
    reviewId?: number;
    order?: "AR" | "UR" | "CA";
    tag?: string;
    full?: boolean;
    release?: boolean;
    forUserId?: number;
    countComments?: boolean;
}
export interface CreateReview {
    description: string;
    text: string;
    authorRating: number;
    userId: number;
    titleId: number;
    groupId: number;
    draft: boolean;
    tags: number[];
    blocked?: boolean;
    transaction?: Transaction;
}
export interface UpdateReview extends CreateReview {
    id: number;
    blocked?: boolean;
    superEdit?: boolean;
}
export interface DeleteReview {
    id: number;
    transaction?: Transaction;
    userId?: number;
    superEdit?: boolean;
}
export interface RemoveReview extends DeleteReview {
}
export interface RestoreReview extends DeleteReview {
}
export declare class ReviewsService {
    private sequelize;
    private reviews;
    private tags;
    private reviewTags;
    private titleGroups;
    constructor(sequelize: Sequelize, reviews: typeof Review, tags: typeof Tag, reviewTags: typeof ReviewTags, titleGroups: typeof TitleGroups);
    createReview(opts: CreateReview, createWithOutGroupTitle?: boolean): Promise<Review>;
    protected _patchReviewTag(t: Transaction, reviewId: number, tags: number[]): Promise<void>;
    protected _updateReviewTag(t: Transaction, reviewId: number, tags: number[]): Promise<void>;
    editReview(opts: UpdateReview): Promise<Review>;
    _createReviewOther(t: Transaction, tags: number[], reviewId: number): Promise<void>;
    removeReview(opts: RemoveReview): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreReview(opts: RestoreReview): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteReview(opts: DeleteReview): Promise<{
        id: number;
    }>;
    getReviewAll(opts: OptionsQueryAll): Promise<Review[]>;
    getReviewOne(opts: OptionsQueryOne): Promise<Review>;
    getShortReviewAll(): Promise<Review[]>;
    getShortOtherReviewAll(groupTitleId: number): Promise<Review[]>;
    protected buildQueryAll(opts: OptionsQueryAll): any;
    protected buildQueryOne(opts: OptionsQueryOne): any;
    getReviewTagAll(count: number, offset?: number): Promise<ReviewTags[]>;
}
interface OptionsQueryAll {
    withDeleted?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
    withTags?: number[];
    withTitles?: number[];
    withGroups?: number[];
    withAuthors?: number[];
    sortField?: string;
    sortType?: "ASC" | "DESC";
    condUserId?: number;
    condPublic?: boolean;
    forUserId?: number;
    getByIds?: number[];
    condBlocked?: boolean;
}
interface OptionsQueryOne {
    reviewId: number;
    withDeleted?: boolean;
    transaction?: Transaction;
    condUserId?: number;
    condPublic?: boolean;
    forUserId?: number;
    withCommentAll?: boolean;
    condBlocked?: boolean;
    condCommentsPublic?: boolean;
    condCommentsBlocked?: boolean;
    condCommentsWithDeleted?: boolean;
}
export {};
