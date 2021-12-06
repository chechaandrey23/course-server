import { Sequelize } from 'sequelize-typescript';
import { UserInfo } from './userinfo.model';
import { Theme } from '../themes/theme.model';
import { Lang } from '../langs/lang.model';
import { User } from '../users/user.model';
export declare class UserInfosService {
    private sequelize;
    private userInfos;
    private themes;
    private langs;
    private users;
    constructor(sequelize: Sequelize, userInfos: typeof UserInfo, themes: typeof Theme, langs: typeof Lang, users: typeof User);
    createUserInfo(userId: number): Promise<UserInfo>;
    editUserInfo(id: number, userId: number, first_name: string, last_name: string, themeId: number, langId: number): Promise<UserInfo>;
    removeUserInfo(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreUserInfo(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteUserInfo(id: number): Promise<{
        id: number;
    }>;
    getUserInfoAll(count: number, offset?: number, withDeleted?: boolean): Promise<UserInfo[]>;
}
