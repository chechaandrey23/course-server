import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Title } from './title.model';
import { TitleGroups } from './title.groups.model';
import { Group } from '../groups/group.model';
export declare class TitlesService {
    private sequelize;
    private titles;
    private groups;
    private titleGroups;
    constructor(sequelize: Sequelize, titles: typeof Title, groups: typeof Group, titleGroups: typeof TitleGroups);
    createTitle(title: string, description: string): Promise<Title>;
    _patchTitleGroups(t: Transaction, titleId: number): Promise<void>;
    editTitle(id: number, title: string, description: string): Promise<Title>;
    removeTitle(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTitle(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTitle(id: number): Promise<{
        id: number;
    }>;
    getTitleAll(count: number, offset?: number, withDeleted?: boolean): Promise<Title[]>;
    getShortTitleAll(count: number, offset?: number): Promise<Title[]>;
    getPartTitleAll(count: number, offset: number, query: string): Promise<Title[]>;
    getTitleGroupAll(count: number, offset?: number): Promise<TitleGroups[]>;
}
