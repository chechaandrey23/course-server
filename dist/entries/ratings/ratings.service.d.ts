import { Transaction } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import { Rating } from './rating.model';
export interface CreateRating {
    userId: number;
    transaction?: Transaction;
    reviewId: number;
    rating: number;
}
export interface UpdateRating extends CreateRating {
    id: number;
    superEdit?: boolean;
}
export interface DeleteRating {
    id: number;
    transaction?: Transaction;
    userId?: number;
    superEdit?: boolean;
}
export interface RemoveRating extends DeleteRating {
}
export interface RestoreRating extends DeleteRating {
}
export declare class RatingsService {
    private sequelize;
    private ratings;
    constructor(sequelize: Sequelize, ratings: typeof Rating);
    createRating(opts: CreateRating): Promise<Rating>;
    editRating(opts: UpdateRating): Promise<Rating>;
    removeRating(opts: RemoveRating): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreRating(opts: RestoreRating): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteRating(opts: DeleteRating): Promise<{
        id: number;
    }>;
    getRatingAll(count: number, offset?: number, withDeleted?: boolean): Promise<Rating[]>;
}
