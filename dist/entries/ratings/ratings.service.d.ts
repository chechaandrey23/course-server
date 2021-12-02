import { Sequelize } from 'sequelize-typescript';
import { Rating } from './rating.model';
export declare class RatingsService {
    private sequelize;
    private ratings;
    constructor(sequelize: Sequelize, ratings: typeof Rating);
    createRating(reviewId: number, userId: number, rating: number): Promise<Rating>;
    editRating(id: number, reviewId: number, userId: number, rating: number): Promise<Rating>;
    removeRating(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    deleteRating(id: number): Promise<{
        id: number;
    }>;
    getRatingAll(count: number, offset?: number, withDeleted?: boolean): Promise<Rating[]>;
}
