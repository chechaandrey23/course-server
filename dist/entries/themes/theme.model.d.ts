import { Model } from "sequelize-typescript";
interface CreateTheme {
    theme: string;
    title: string;
    description?: string;
}
export declare class Theme extends Model<Theme, CreateTheme> {
    id: number;
    theme: string;
    title: string;
    description: string;
}
export {};
