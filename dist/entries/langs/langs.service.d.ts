import { Sequelize } from 'sequelize-typescript';
import { Lang } from './lang.model';
export declare class LangsService {
    private sequelize;
    private langs;
    constructor(sequelize: Sequelize, langs: typeof Lang);
    createLang(lang: string, title: string, description: string): Promise<Lang>;
    editLang(id: number, lang: string, title: string, description: string): Promise<Lang>;
    removeLang(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreLang(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteLang(id: number): Promise<{
        id: number;
    }>;
    getLangAll(count: number, offset?: number, withDeleted?: boolean): Promise<Lang[]>;
    getShortLangAll(): Promise<Lang[]>;
}
