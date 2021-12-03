import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Review } from './review.model';
import { ReviewTags } from './review.tags.model';
import { TitleGroups } from '../titles/title.groups.model';
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
export declare class ReviewsService {
    private sequelize;
    private reviews;
    private reviewTags;
    private titleGroups;
    constructor(sequelize: Sequelize, reviews: typeof Review, reviewTags: typeof ReviewTags, titleGroups: typeof TitleGroups);
    createReview(description: string, text: string, authorRating: number, userId: number, titleId: number, groupId: number, draft: boolean, tags: number[], createWithOutGroupTitle?: boolean): Promise<Review>;
    editReview(id: number, description: string, text: string, authorRating: number, userId: number, titleId: number, groupId: number, draft: boolean, tags: number[]): Promise<Review>;
    _createReviewOther(t: Transaction, tags: number[], reviewId: number): Promise<void>;
    removeReview(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    deleteReview(id: number): Promise<{
        id: number;
    }>;
    getReviewAll(opts: OptionsQueryAll): Promise<Review[]>;
    getReviewOne(opts: OptionsQueryOne): Promise<Review>;
    getShortReviewAll(): Promise<Review[]>;
    protected buildQuery(opts: queryOptions): any;
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
}
export {};
