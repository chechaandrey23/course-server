import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Role } from './role.model';
import { UserRoles } from '../users/user.roles.model';
import { User } from '../users/user.model';
export declare class RolesService {
    private sequelize;
    private roles;
    private users;
    private userRoles;
    constructor(sequelize: Sequelize, roles: typeof Role, users: typeof User, userRoles: typeof UserRoles);
    createRole(role: number, title: string, description: string): Promise<Role>;
    _patchUserRoles(t: Transaction, roleId: number): Promise<void>;
    editRole(id: number, role: number, title: string, description: string): Promise<Role>;
    removeRole(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreRole(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteRole(id: number): Promise<{
        id: number;
    }>;
    getRoleAll(count: number, offset?: number, withDeleted?: boolean): Promise<Role[]>;
    getShortRoleAll(): Promise<Role[]>;
}
