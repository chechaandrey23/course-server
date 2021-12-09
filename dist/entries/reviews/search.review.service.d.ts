import { Sequelize } from 'sequelize-typescript';
import { ReviewsService, UpdateReview, CreateReview } from './reviews.service';
import { ReviewElasticSearchService } from '../reviewelasticsearch/review.elastic.search.service';
import { Review } from './review.model';
export declare class SearchReviewService {
    private sequelize;
    private reviewsService;
    private reviews;
    private reviewElasticSearch;
    constructor(sequelize: Sequelize, reviewsService: ReviewsService, reviews: typeof Review, reviewElasticSearch: ReviewElasticSearchService);
    getReviewForSearchAll(opts: any): Promise<Review[]>;
    getSearchAll(query: string, opts: any): Promise<Review[]>;
    getDualReviewIndex(reviewId: number, searchId: string): Promise<{
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
    createReviewWithIndexing(opts: CreateReview): Promise<any>;
    updateReviewWithIndexing(opts: UpdateReview): Promise<any>;
    deleteReviewWithDeleteIndex(reviewId: number): Promise<{
        id: number;
    }>;
}
