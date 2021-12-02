import { Model } from "sequelize-typescript";
import { User } from "./user.model";
import { Role } from "../roles/role.model";
interface CreateUserRole {
    roleId: number;
    userId: number;
}
export declare class UserRoles extends Model<UserRoles, CreateUserRole> {
    roleId: number;
    userId: number;
    user: User;
    selected: boolean;
    role: Role;
}
export {};
