import { Sequelize } from 'sequelize-typescript';
import { ReviewsService, UpdateReview, CreateReview, DeleteReview, RemoveReview, RestoreReview } from './reviews.service';
import { ReviewElasticSearchService } from '../reviewelasticsearch/review.elastic.search.service';
import { Review } from './review.model';
export interface SearchDeleteReview extends DeleteReview {
}
export interface SearchRemoveReview extends RemoveReview {
}
export interface SearchRestoreReview extends RestoreReview {
}
export interface SearchCreateReview extends CreateReview {
}
export interface SearchUpdateReview extends UpdateReview {
}
export declare class SearchReviewService {
    private sequelize;
    private reviewsService;
    private reviews;
    private reviewElasticSearch;
    constructor(sequelize: Sequelize, reviewsService: ReviewsService, reviews: typeof Review, reviewElasticSearch: ReviewElasticSearchService);
    getReviewForSearchAll(opts: any): Promise<Review[]>;
    getSearchAll(query: string, opts: any): Promise<Review[]>;
    getDualReviewIndex(reviewId: number, searchId: string, withDeleted?: boolean): Promise<{
        review: Review;
        index: import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>;
    }>;
    createIndex(reviewId: number): Promise<{
        id: number;
        searchId: any;
    }>;
    deleteIndex(reviewId: number, searchId: string): Promise<{
        id: number;
        searchId: any;
    }>;
    createReviewWithIndexing(opts: SearchCreateReview): Promise<any>;
    updateReviewWithIndexing(opts: SearchUpdateReview): Promise<any>;
    deleteReviewWithDeleteIndex(opts: SearchDeleteReview): Promise<{
        id: number;
    }>;
    removeReviewWithDeleteIndex(opts: SearchRemoveReview): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreReviewWithDeleteIndex(opts: SearchRestoreReview): Promise<{
        id: number;
        deletedAt: any;
    }>;
}
