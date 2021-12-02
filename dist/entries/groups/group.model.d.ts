import { Model } from "sequelize-typescript";
import { Title } from '../titles/title.model';
interface CreateGroup {
    group: string;
    description?: string;
}
export declare class Group extends Model<Group, CreateGroup> {
    id: number;
    group: string;
    description: string;
    titles: Title[];
}
export {};
