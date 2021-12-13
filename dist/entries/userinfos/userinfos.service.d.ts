import { Sequelize } from 'sequelize-typescript';
import { Transaction } from "sequelize";
import { UserInfo } from './userinfo.model';
import { Theme } from '../themes/theme.model';
import { Lang } from '../langs/lang.model';
import { User } from '../users/user.model';
export interface CreateUserInfo {
    userId: number;
    transaction?: Transaction;
}
export interface UpdateUserInfo {
    id: number;
    superEdit?: boolean;
    userId: number;
    transaction?: Transaction;
    first_name: string;
    last_name: string;
    themeId: number;
    langId: number;
}
export interface DeleteUserInfo {
    id: number;
    transaction?: Transaction;
    userId?: number;
    superEdit?: boolean;
}
export interface RemoveUserInfo extends DeleteUserInfo {
}
export interface RestoreUserInfo extends DeleteUserInfo {
}
export declare class UserInfosService {
    private sequelize;
    private userInfos;
    private themes;
    private langs;
    private users;
    constructor(sequelize: Sequelize, userInfos: typeof UserInfo, themes: typeof Theme, langs: typeof Lang, users: typeof User);
    createUserInfo(opts: CreateUserInfo): Promise<UserInfo>;
    editUserInfo(opts: UpdateUserInfo): Promise<UserInfo>;
    removeUserInfo(opts: RemoveUserInfo): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreUserInfo(opts: RestoreUserInfo): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteUserInfo(opts: DeleteUserInfo): Promise<{
        id: number;
    }>;
    getUserInfoAll(count: number, offset?: number, withDeleted?: boolean): Promise<UserInfo[]>;
}
