import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Tag } from './tag.model';
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
    constructor(sequelize: Sequelize, tags: typeof Tag);
    createTag(tag: string): Promise<Tag>;
    editTag(id: number, tag: string): Promise<Tag>;
    removeTag(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    deleteTag(id: number): Promise<{
        id: number;
    }>;
    getTagAll(opts: queryOptions): Promise<Tag[]>;
    protected buildQuery(opts: queryOptions): any;
    getPartTagAll(count: number, offset: number, query: string): Promise<Tag[]>;
    getShortTagAll(): Promise<Tag[]>;
}
