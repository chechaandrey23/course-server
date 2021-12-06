import { Sequelize } from 'sequelize-typescript';
import { Theme } from './theme.model';
export declare class ThemesService {
    private sequelize;
    private themes;
    constructor(sequelize: Sequelize, themes: typeof Theme);
    createTheme(theme: string, title: string, description: string): Promise<Theme>;
    editTheme(id: number, theme: string, title: string, description: string): Promise<Theme>;
    removeTheme(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreTheme(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteTheme(id: number): Promise<{
        id: number;
    }>;
    getThemeAll(count: number, offset?: number, withDeleted?: boolean): Promise<Theme[]>;
    getShortThemeAll(): Promise<Theme[]>;
}
