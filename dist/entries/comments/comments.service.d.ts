import { Sequelize } from 'sequelize-typescript';
import { Comment } from './comment.model';
export declare class CommentsService {
    private sequelize;
    private comments;
    constructor(sequelize: Sequelize, comments: typeof Comment);
    createComment(reviewId: number, userId: number, comment: string, draft: boolean, blocked: boolean): Promise<Comment>;
    editComment(id: number, reviewId: number, userId: number, comment: string, draft: boolean, blocked: boolean): Promise<Comment>;
    removeComment(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    deleteComment(id: number): Promise<{
        id: number;
    }>;
    getCommentAll(count: number, offset?: number, withDeleted?: boolean): Promise<Comment[]>;
    getCommentReviewAll(count: number, offset: number, reviewId: number, isPublic?: boolean, blocked?: boolean, withDeleted?: boolean): Promise<Comment[]>;
    getAutoUpdateCommentAll(time: number, reviewId: number, isPublic?: boolean, blocked?: boolean, withDeleted?: boolean): Promise<Comment[]>;
}
