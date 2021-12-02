import { Model } from "sequelize-typescript";
import { Title } from "./title.model";
import { Group } from "../groups/group.model";
export interface CreateTitleGroup {
    titleId: number;
    groupId: number;
}
export declare class TitleGroups extends Model<TitleGroups, CreateTitleGroup> {
    id: number;
    groupId: number;
    titleId: number;
    title: Title;
    group: Group;
}
