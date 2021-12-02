import { Model } from "sequelize-typescript";
interface CreateReviewTag {
    reviewId: number;
    tagId: number;
}
export declare class ReviewTags extends Model<ReviewTags, CreateReviewTag> {
    reviewId: number;
    tagId: number;
}
export {};
