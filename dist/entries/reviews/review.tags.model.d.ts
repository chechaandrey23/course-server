import { Model } from "sequelize-typescript";
import { Review } from "./review.model";
import { Tag } from "../tags/tag.model";
interface CreateReviewTag {
    reviewId: number;
    tagId: number;
    selected: boolean;
}
export declare class ReviewTags extends Model<ReviewTags, CreateReviewTag> {
    reviewId: number;
    review: Review;
    tagId: number;
    tag: Tag;
    selected: boolean;
}
export {};
