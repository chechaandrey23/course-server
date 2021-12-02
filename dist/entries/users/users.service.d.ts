import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { User } from './user.model';
import { UserRoles } from './user.roles.model';
import { Role } from '../roles/role.model';
import { UserInfo } from '../userinfos/userinfo.model';
import { Theme } from '../themes/theme.model';
import { Lang } from '../langs/lang.model';
export declare class UsersService {
    private sequelize;
    private roles;
    private users;
    private userInfos;
    private themes;
    private langs;
    private userRoles;
    constructor(sequelize: Sequelize, roles: typeof Role, users: typeof User, userInfos: typeof UserInfo, themes: typeof Theme, langs: typeof Lang, userRoles: typeof UserRoles);
    protected hashedPassword(password: string): Promise<string>;
    protected comparePassword(hash: string, clientPassword: string): Promise<boolean>;
    protected isSelectedRoleNewUser(role: any): boolean;
    protected getRoleEditorUser(): number;
    protected getRoleUserUser(): number;
    createUser(user: string, password: string, email: string, first_name?: string, last_name?: string): Promise<User>;
    createSocialUser(social_id: string, vendor: string, softCreate?: boolean, displayName?: string): Promise<User>;
    _createUserOther(t: Transaction, userId: number, displayName: string[]): Promise<void>;
    editUserAdmin(id: number, user: string, social_id: string, email: string, blocked: boolean, activated: boolean, roles: number[]): Promise<User>;
    changePassword(id: number, prevPassword: string, newPassword: string): Promise<void>;
    removeUser(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    deleteUser(id: number): Promise<{
        id: number;
    }>;
    checkUser(username: string, password: string): Promise<any>;
    checkUserId(id: number): Promise<any>;
    getUserAll(count: number, offset?: number, withDeleted?: boolean): Promise<User[]>;
    getUserOne(id: number): Promise<User>;
    getShortUserAll(count: number, offset?: number): Promise<User[]>;
    getShortEditorUserAll(count: number, offset?: number): Promise<User[]>;
    getShortUserUserAll(count: number, offset?: number): Promise<User[]>;
    getUserRoleAll(count: number, offset?: number): Promise<UserRoles[]>;
}
