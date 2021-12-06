import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Tag } from './tag.model';
import { Review } from '../reviews/review.model';
import { ReviewTags } from '../reviews/review.tags.model';
export interface queryOptions {
    withDeleted?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
    order?: boolean;
    userId?: number;
}
export declare class TagsService {
    private sequelize;
    private tags;
    private reviews;
    private reviewTags;
    constructor(sequelize: Sequelize, tags: typeof Tag, reviews: typeof Review, reviewTags: typeof ReviewTags);
    createTag(tag: string): Promise<Tag>;
    protected _patchReviewTag(t: Transaction, tagId: number): Promise<void>;
    editTag(id: number, tag: string): Promise<Tag>;
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
    getTagAll(opts: queryOptions): Promise<Tag[]>;
    protected buildQuery(opts: queryOptions): any;
    getPartTagAll(count: number, offset: number, query: string): Promise<Tag[]>;
    getShortTagAll(): Promise<Tag[]>;
}
