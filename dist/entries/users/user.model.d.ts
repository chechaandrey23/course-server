import { Model } from "sequelize-typescript";
import { Role } from '../roles/role.model';
import { UserInfo } from '../userinfos/userinfo.model';
interface CreateUser {
    password: string;
    user: string;
    email: string;
}
interface CreateSocialUser {
    social_id: string;
}
export declare class User extends Model<User, CreateUser | CreateSocialUser> {
    id: number;
    user: string;
    password: string;
    social_id: string;
    email: string;
    blocked: boolean;
    activated: boolean;
    roles: Role[];
    userInfo: UserInfo;
}
export {};
