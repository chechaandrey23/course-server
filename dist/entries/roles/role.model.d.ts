import { Model } from "sequelize-typescript";
import { User } from '../users/user.model';
interface CreateRole {
    role: number;
    title: string;
    description: string;
}
export declare class Role extends Model<Role, CreateRole> {
    id: number;
    role: number;
    title: string;
    description: string;
    users: User[];
}
export {};
