import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
import { Theme } from '../themes/theme.model';
import { Lang } from '../langs/lang.model';
interface CreateUserInfo {
    userId: number;
    langId: number;
    themeId: number;
    first_name?: string;
    last_name?: string;
}
interface EditUserInfo {
    first_name: string;
    last_name: string;
    langId: number;
    themeId: number;
}
export declare class UserInfo extends Model<UserInfo, CreateUserInfo | EditUserInfo> {
    id: number;
    first_name: string;
    last_name: string;
    themeId: number;
    theme: Theme;
    langId: number;
    lang: Lang;
    userId: number;
    user: User;
}
export {};
