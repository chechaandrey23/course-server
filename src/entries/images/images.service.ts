import {HttpException, HttpStatus, Injectable, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {Image} from './image.model';
//import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';

import {Storage} from '@google-cloud/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

	public async createImage(/*reviewId: number, */userId: number, images: Array<Express.Multer.File>) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res0 = await this.users.findOne({where: {id: userId}, transaction: t})
				if(!res0) throw new ConflictException({userId, reason: `User (userId: ${userId}) does not exist`});

				let newData = [];

				for(const image of images) {console.log(image)
					const fileName = `${uuidv4()}.${image.originalname.split('.').at(-1)}`;
					const linkFilename: string = await this.upLoad(fileName, image.buffer);
					newData.push({userId, url: linkFilename, filename: fileName, vendor: 'google.bucket'});
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

	public async editImage(id: number, userId: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.images.update({userId}, {where: {id}, transaction: t});

				return await this.images.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id']}], where: {id: id}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
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

	public async removeImage(id: number) {
		try {
			await this.images.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteImage(id: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.images.findOne({where: {id}, paranoid: false, transaction: t});
				if(!res) throw new ConflictException({id, reason: `Image record id="${id}" NOT FOUND`});

				await this.storageGoogleBucket.file(res.getDataValue('filename')).delete();

				await this.images.destroy({where: {id}, transaction: t, force: true});

				return {id: id};
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async getImageAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.images.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted},
			/*{model: Review, attributes: ['id', 'title'], paranoid: !withDeleted}*/], offset: offset, limit: count, paranoid: !withDeleted});
	}
}
