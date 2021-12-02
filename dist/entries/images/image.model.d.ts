import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
interface CreateImage {
    url: string;
    vendor: string;
    userId: number;
}
export declare class Image extends Model<Image, CreateImage> {
    id: number;
    url: string;
    filename: string;
    vendor: string;
    userId: number;
    user: User;
}
export {};
