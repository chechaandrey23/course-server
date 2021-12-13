import { Transaction } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import { Like } from './like.model';
export interface CreateLike {
    userId: number;
    transaction?: Transaction;
    reviewId: number;
    like: boolean;
}
export interface UpdateLike extends CreateLike {
    id: number;
    superEdit?: boolean;
}
export interface DeleteLike {
    id: number;
    transaction?: Transaction;
    userId?: number;
    superEdit?: boolean;
}
export interface RemoveLike extends DeleteLike {
}
export interface RestoreLike extends DeleteLike {
}
export declare class LikesService {
    private sequelize;
    private likes;
    constructor(sequelize: Sequelize, likes: typeof Like);
    createLike(opts: CreateLike): Promise<Like>;
    editLike(opts: UpdateLike): Promise<Like>;
    removeLike(opts: RemoveLike): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreLike(opts: RestoreLike): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteLike(opts: DeleteLike): Promise<{
        id: number;
    }>;
    getLikeAll(count: number, offset?: number, withDeleted?: boolean): Promise<Like[]>;
}
