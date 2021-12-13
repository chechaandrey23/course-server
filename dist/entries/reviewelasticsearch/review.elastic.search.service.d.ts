import { ElasticsearchService } from '@nestjs/elasticsearch';
export interface ReviewSearch {
    id: number;
    description: string;
    text: string;
    groupTitle?: {
        group?: {
            group: string;
        };
        title?: {
            title: string;
            description: string;
        };
    };
    tags?: Array<{
        tag: string;
    }>;
    user?: {
        userInfo?: {
            first_name: string;
            last_name: string;
        };
    };
    comments?: Array<{
        id: number;
        comment: string;
    }>;
    blocked: boolean;
    draft: boolean;
    deletedAt: any;
}
export interface ReviewCommentBody {
    id: number;
    comment: string;
}
export interface ReviewSearchBody {
    id: number;
    blocked: boolean;
    draft: boolean;
    removed: boolean;
    description: string;
    text: string;
    group: string;
    title: string;
    titleDescription: string;
    tags: Array<string>;
    authorFullName: string;
    comments?: Array<ReviewCommentBody>;
}
export interface ReviewSearchResult {
    hits: {
        total: number;
        hits: Array<{
            _source: ReviewSearchBody;
            _id: string;
        }>;
    };
}
export declare class ReviewElasticSearchService {
    private elasticsearchService;
    protected index: string;
    constructor(elasticsearchService: ElasticsearchService);
    indexReview(review: ReviewSearch): Promise<import("@elastic/elasticsearch").ApiResponse<ReviewSearchBody, unknown>>;
    searchReviews(text: string, offset: number, count: number): Promise<{
        ids: any[];
        searchIds: any[];
    }>;
    getReviewIndex(id: number): Promise<import("@elastic/elasticsearch").ApiResponse<ReviewSearchResult, unknown>>;
    getReviewIndexWithIndex(id: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    deleteReview(reviewId: number): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    deleteReviewWithId(id: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    protected getScriptUpdate(review: ReviewSearch): string;
    updateReview(review: ReviewSearch): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    updateReviewWithId(id: string, review: ReviewSearch): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    removeReview(id: number): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    removeReviewWithId(id: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    restoreReview(id: number): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    restoreReviewWithId(id: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    addReviewComment(reviewId: number, commentId: number, comment: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    deleteReviewComment(reviewId: number, commentId: number): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    protected scriptUpdate: string;
    updateReviewComment(reviewId: number, commentId: number, comment: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    addReviewCommentWithId(id: string, commentId: number, comment: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    deleteReviewCommentWithId(id: string, commentId: number): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
    updateReviewCommentWithId(id: string, commentId: number, comment: string): Promise<import("@elastic/elasticsearch").ApiResponse<Record<string, any>, unknown>>;
}
