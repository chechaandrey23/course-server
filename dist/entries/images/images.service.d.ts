/// <reference types="multer" />
/// <reference types="node" />
import { Sequelize } from 'sequelize-typescript';
import { Image } from './image.model';
import { User } from '../users/user.model';
export declare class ImagesService {
    private sequelize;
    private images;
    private users;
    private storageGoogleCloud;
    private storageGoogleBucket;
    constructor(sequelize: Sequelize, images: typeof Image, users: typeof User);
    createImage(userId: number, images: Array<Express.Multer.File>): Promise<Image[]>;
    editImage(id: number, userId: number): Promise<Image[]>;
    protected upLoad(filename: string, buffer: Buffer): Promise<string>;
    removeImage(id: number): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreImage(id: number): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteImage(id: number): Promise<{
        id: number;
    }>;
    getImageAll(count: number, offset?: number, withDeleted?: boolean): Promise<Image[]>;
}
