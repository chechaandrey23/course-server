import { Sequelize } from 'sequelize-typescript';
import { CommentsService, CreateComment, UpdateComment, RemoveComment, DeleteComment, RestoreComment } from './comments.service';
import { ReviewElasticSearchService } from '../reviewelasticsearch/review.elastic.search.service';
import { Review } from '../reviews/review.model';
import { Comment } from './comment.model';
export interface SearchDeleteComment extends DeleteComment {
}
export interface SearchRemoveComment extends RemoveComment {
}
export interface SearchRestoreComment extends RestoreComment {
}
export interface SearchCreateComment extends CreateComment {
}
export interface SearchUpdateComment extends UpdateComment {
}
export declare class SearchCommentService {
    private sequelize;
    private commentsService;
    private reviews;
    private comments;
    private reviewElasticSearch;
    constructor(sequelize: Sequelize, commentsService: CommentsService, reviews: typeof Review, comments: typeof Comment, reviewElasticSearch: ReviewElasticSearchService);
    createCommentWithIndexing(opts: SearchCreateComment): Promise<any>;
    updateCommentWithIndexing(opts: SearchUpdateComment): Promise<any>;
    deleteCommentWithIndexing(opts: SearchDeleteComment): Promise<{
        id: number;
    }>;
    removeCommentWithIndexing(opts: SearchRemoveComment): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreCommentWithIndexing(opts: SearchRestoreComment): Promise<{
        id: number;
        deletedAt: any;
    }>;
}
