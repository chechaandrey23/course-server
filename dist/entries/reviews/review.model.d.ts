import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
import { Tag } from '../tags/tag.model';
import { TitleGroups } from '../titles/title.groups.model';
import { Rating } from '../ratings/rating.model';
import { Like } from '../likes/like.model';
import { Comment } from '../comments/comment.model';
interface CreateReview {
    description: string;
    text: string;
    authorRating: number;
    userId: number;
    titleGroupId: number;
    draft: boolean;
    blocked: boolean;
}
interface CreateReviewSearchId {
    searchId: string;
}
export declare class Review extends Model<Review, CreateReview | CreateReviewSearchId> {
    id: number;
    blocked: boolean;
    description: string;
    text: string;
    draft: boolean;
    authorRating: number;
    userId: number;
    user: User;
    tags: Tag[];
    titleGroupId: number;
    groupTitle: TitleGroups;
    ratings: Rating;
    likes: Like;
    searchId: string;
    comments: Comment;
}
export {};
