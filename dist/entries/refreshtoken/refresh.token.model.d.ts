import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
interface CreateToken {
    userId: number;
    dateEndRT1: number;
    RT1: string;
}
export declare class RefreshToken extends Model<RefreshToken, CreateToken> {
    id: number;
    userId: number;
    user: User;
    dateEndRT1: any;
    RT1: string;
}
export {};
