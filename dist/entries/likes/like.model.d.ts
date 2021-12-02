import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
import { Review } from '../reviews/review.model';
interface CreateLike {
    userId: number;
    reviewId: number;
    like: boolean;
}
export declare class Like extends Model<Like, CreateLike> {
    id: number;
    userId: number;
    user: User;
    reviewId: number;
    review: Review;
    like: boolean;
}
export {};
