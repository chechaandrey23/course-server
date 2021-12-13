import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op, Transaction} from "sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {Image} from './image.model';
//import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';

import {Storage} from '@google-cloud/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface CreateImage {
	userId: number;
	superEdit?: boolean;
	transaction?: Transaction;
	images: Array<Express.Multer.File>
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

export interface RemoveImage extends DeleteImage {}

export interface RestoreImage extends DeleteImage {}

@Injectable()
export class ImagesService {
	private storageGoogleCloud: Storage;
	private storageGoogleBucket: any;

	constructor(private sequelize: Sequelize, @InjectModel(Image) private images: typeof Image, @InjectModel(User) private users: typeof User) {
		this.storageGoogleCloud = new Storage({
			keyFilename: path.resolve()+'/test-backet-4642555c8a69.json',
			projectId: 'test-backet'
		});
		this.storageGoogleBucket = this.storageGoogleCloud.bucket('course-share-file');
		//this.googleCloudStorage.getBuckets().then((a) => {console.log(a)})
	}

	public async createImage(opts: CreateImage) {// /*reviewId: number, */userId: number, images: Array<Express.Multer.File>) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				let res0 = await this.users.findOne({where: {id: opts.userId}, transaction: t})
				if(!res0) throw new ConflictException({userId: opts.userId, reason: `User (userId: ${opts.userId}) does not exist`});

				let newData = [];

				for(const image of opts.images) {
					const extNameArr = image.originalname.split('.');
					const fileName = `${uuidv4()}.${extNameArr[extNameArr.length - 1]}`;
					const linkFilename: string = await this.upLoad(fileName, image.buffer);
					newData.push({userId: opts.userId, url: linkFilename, filename: fileName, vendor: 'google.bucket'});
				}

				let res1 = await this.images.bulkCreate(newData, {transaction: t});
				let ids = res1.map((entry) => {return entry.getDataValue('id')});
				//console.log(res1, ids)

				return await this.images.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id']}], where: {id: ids}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async editImage(opts: UpdateImage) { //id: number, userId: number) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(!opts.superEdit) throw new NotAcceptableException(`Content can be edited with the passed "superEdit" option`);

				await this.images.update({userId: opts.userId}, {where: {id: opts.id}, transaction: t});

				return await this.images.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id']}], where: {id: opts.id}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	protected upLoad(filename: string, buffer: Buffer): Promise<string> {
		return new Promise((res, rej) => {
			const blob = this.storageGoogleBucket.file(filename);
			const blobStream = blob.createWriteStream({
				resumable: false,
				gzip: true
			});
			blobStream.on('error', err => {
				rej(err);
			});
			blobStream.on('finish', () => {
				res(`https://storage.googleapis.com/${this.storageGoogleBucket.name}/${blob.name}`);
			});
			blobStream.end(buffer);
		});
	}

	public async removeImage(opts: RemoveImage) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.images.destroy({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.images.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`REMOVE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.images.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: (new Date()).toString()}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreImage(opts: RestoreImage) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.images.restore({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.images.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`RESTORE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.images.restore({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: null}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteImage(opts:DeleteImage) {//id: number) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				let res: any;
				if(opts.superEdit) {
					res = await this.images.findOne({where: {id: opts.id}, paranoid: false, transaction: t});
					if(!res) throw new ConflictException({id: opts.id, reason: `Image record id="${opts.id}" NOT FOUND`});
					await this.images.destroy({where: {id: opts.id}, transaction: t, force: true});
				} else {
					res = await this.images.findOne({where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`DESTROY: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.images.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t, force: true});
				}

				let gres = await this.storageGoogleBucket.file(res.getDataValue('filename')).delete();
				console.log(gres);

				return {id: opts.id};
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async getImageAll(opts: GetImageAll) {//count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.images.findAll({
			include: [{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !opts.withDeleted}],
			where: {...(opts.condUserId?{userId: opts.condUserId}:{})},
			offset: opts.offset || 0,
			limit: opts.limit,
			paranoid: !opts.withDeleted
		});
	}
}

export interface GetImageAll {
	withDeleted?: boolean;
	limit?: number;
	offset?: number;
	transaction?: Transaction;
	condUserId?: number;
}
