/// <reference types="multer" />
/// <reference types="node" />
import { Transaction } from "sequelize";
import { Sequelize } from 'sequelize-typescript';
import { Image } from './image.model';
import { User } from '../users/user.model';
export interface CreateImage {
    userId: number;
    superEdit?: boolean;
    transaction?: Transaction;
    images: Array<Express.Multer.File>;
}
export interface UpdateImage {
    id: number;
    userId?: number;
    superEdit?: boolean;
    transaction?: Transaction;
}
export interface DeleteImage {
    id: number;
    transaction?: Transaction;
    userId?: number;
    superEdit?: boolean;
}
export interface RemoveImage extends DeleteImage {
}
export interface RestoreImage extends DeleteImage {
}
export declare class ImagesService {
    private sequelize;
    private images;
    private users;
    private storageGoogleCloud;
    private storageGoogleBucket;
    constructor(sequelize: Sequelize, images: typeof Image, users: typeof User);
    createImage(opts: CreateImage): Promise<Image[]>;
    editImage(opts: UpdateImage): Promise<Image[]>;
    protected upLoad(filename: string, buffer: Buffer): Promise<string>;
    removeImage(opts: RemoveImage): Promise<{
        id: number;
        deletedAt: string;
    }>;
    restoreImage(opts: RestoreImage): Promise<{
        id: number;
        deletedAt: any;
    }>;
    deleteImage(opts: DeleteImage): Promise<{
        id: number;
    }>;
    getImageAll(opts: GetImageAll): Promise<Image[]>;
}
export interface GetImageAll {
    withDeleted?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
    condUserId?: number;
}
