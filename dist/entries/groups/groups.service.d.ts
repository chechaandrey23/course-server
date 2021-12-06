import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Group } from './group.model';
import { TitleGroups } from '../titles/title.groups.model';
import { Title } from '../titles/title.model';
export declare class GroupsService {
    private sequelize;
    private groups;
    private titles;
    private titleGroups;
    constructor(sequelize: Sequelize, groups: typeof Group, titles: typeof Title, titleGroups: typeof TitleGroups);
    createGroup(group: string, description: string): Promise<Group>;
    protected _patchTitleGroups(t: Transaction, groupId: number): Promise<void>;
    editGroup(id: number, group: string, description: string): Promise<Group>;
    removeGroup(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreGroup(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteGroup(id: number): Promise<{
        id: number;
    }>;
    getGroupAll(count: number, offset?: number, withDeleted?: boolean): Promise<Group[]>;
    getShortGroupAll(): Promise<Group[]>;
}
