import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Comment } from './comment.model';
export interface CreateComment {
    reviewId: number;
    userId: number;
    comment: string;
    draft: boolean;
    blocked?: boolean;
    transaction?: Transaction;
}
export interface UpdateComment extends CreateComment {
    id: number;
    superEdit?: boolean;
}
export interface DeleteComment {
    id: number;
    transaction?: Transaction;
    userId?: number;
    superEdit?: boolean;
}
export interface RemoveComment extends DeleteComment {
}
export interface RestoreComment extends DeleteComment {
}
export declare class CommentsService {
    private sequelize;
    private comments;
    constructor(sequelize: Sequelize, comments: typeof Comment);
    createComment(opts: CreateComment): Promise<Comment>;
    editComment(opts: UpdateComment): Promise<Comment>;
    removeComment(opts: RemoveComment): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreComment(opts: RestoreComment): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteComment(opts: DeleteComment): Promise<{
        id: number;
    }>;
    getCommentAll(count: number, offset?: number, withDeleted?: boolean): Promise<Comment[]>;
    getCommentReviewAll(count: number, offset: number, reviewId: number, isPublic?: boolean, blocked?: boolean, withDeleted?: boolean): Promise<Comment[]>;
    getAutoUpdateCommentAll(time: number, reviewId: number, isPublic?: boolean, blocked?: boolean, withDeleted?: boolean): Promise<Comment[]>;
}
