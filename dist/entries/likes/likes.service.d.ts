import { Sequelize } from 'sequelize-typescript';
import { Like } from './like.model';
export declare class LikesService {
    private sequelize;
    private likes;
    constructor(sequelize: Sequelize, likes: typeof Like);
    createLike(reviewId: number, userId: number, like: boolean): Promise<Like>;
    editLike(id: number, reviewId: number, userId: number, like: boolean): Promise<Like>;
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
    getLikeAll(count: number, offset?: number, withDeleted?: boolean): Promise<Like[]>;
}
