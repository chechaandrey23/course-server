import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
import { Review } from '../reviews/review.model';
interface CreateComment {
    userId: number;
    reviewId: number;
    comment: string;
    draft: boolean;
    blocked: boolean;
}
export declare class Comment extends Model<Comment, CreateComment> {
    id: number;
    userId: number;
    user: User;
    reviewId: number;
    review: Review;
    comment: string;
    draft: boolean;
    blocked: boolean;
}
export {};
