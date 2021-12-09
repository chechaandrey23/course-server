import { Sequelize } from 'sequelize-typescript';
import { CommentsService, CreateComment, UpdateComment } from './comments.service';
import { ReviewElasticSearchService } from '../reviewelasticsearch/review.elastic.search.service';
import { Review } from '../reviews/review.model';
import { Comment } from './comment.model';
export declare class SearchCommentService {
    private sequelize;
    private commentsService;
    private reviews;
    private comments;
    private reviewElasticSearch;
    constructor(sequelize: Sequelize, commentsService: CommentsService, reviews: typeof Review, comments: typeof Comment, reviewElasticSearch: ReviewElasticSearchService);
    createCommentWithIndexing(opts: CreateComment): Promise<any>;
    updateCommentWithIndexing(opts: UpdateComment): Promise<any>;
    deleteCommentWithIndexing(commentId: number): Promise<{
        id: number;
    }>;
}
