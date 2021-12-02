import { Model } from "sequelize-typescript";
import { Review } from '../reviews/review.model';
interface CreateTag {
    tag: string;
}
export declare class Tag extends Model<Tag, CreateTag> {
    id: number;
    tag: string;
    reviews: Review[];
}
export {};
