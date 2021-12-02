import { Model } from "sequelize-typescript";
interface CreateLang {
    lang: string;
    title: string;
    description?: string;
}
export declare class Lang extends Model<Lang, CreateLang> {
    id: number;
    lang: string;
    title: string;
    description: string;
}
export {};
