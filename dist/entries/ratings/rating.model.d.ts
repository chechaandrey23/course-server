import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
import { Review } from '../reviews/review.model';
interface CreateRating {
    userId: number;
    reviewId: number;
    userRating: number;
}
export declare class Rating extends Model<Rating, CreateRating> {
    id: number;
    userId: number;
    user: User;
    reviewId: number;
    review: Review;
    userRating: number;
}
export {};
