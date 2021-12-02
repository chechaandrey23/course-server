import { Model } from "sequelize-typescript";
import { Group } from '../groups/group.model';
interface CreateTitle {
    title: string;
    description?: string;
}
export declare class Title extends Model<Title, CreateTitle> {
    id: number;
    title: string;
    description: string;
    groups: Group[];
}
export {};
