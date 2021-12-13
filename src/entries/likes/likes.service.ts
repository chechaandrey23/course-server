import {HttpException, HttpStatus, Injectable, Inject, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op, Transaction} from "sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {Like} from './like.model';
import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';
import {Title} from '../titles/title.model';
import {Group} from '../groups/group.model';
import {TitleGroups} from '../titles/title.groups.model';

export interface CreateLike {
	userId: number;
	transaction?: Transaction;
	reviewId: number;
	like: boolean;
}

export interface UpdateLike extends CreateLike {
	id: number;
	superEdit?: boolean;
}

export interface DeleteLike {
	id: number;
	transaction?: Transaction;
	userId?: number;
	superEdit?: boolean;
}

export interface RemoveLike extends DeleteLike {}

export interface RestoreLike extends DeleteLike {}

@Injectable()
export class LikesService {
	constructor(private sequelize: Sequelize, @InjectModel(Like) private likes: typeof Like) {}

	public async createLike(opts: CreateLike) {//reviewId: number, userId: number, like: boolean) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				let res0 = await this.likes.findOne({where: {reviewId: opts.reviewId, userId: opts.userId}, transaction: t})

				if(res0) throw new ConflictException({
					reviewId: opts.reviewId, userId: opts.userId, reason: `User (userId: ${opts.userId} / reviewId: ${opts.reviewId}) can like only once`
				});

				let res = await this.likes.create({reviewId: opts.reviewId, userId: opts.userId, like: !!opts.like}, {transaction: t});

				return await this.likes.findOne({include: [
					{model: User, attributes: ['id', 'user', 'social_id']},
					{model: Review, attributes: ['id'], include: [{model: TitleGroups, include: [
						{model: Title, attributes: ['id', 'title']},
						{model: Group, attributes: ['id', 'group']}
					]}]}
				], where: {id: res.getDataValue('id'), reviewId: opts.reviewId, userId: opts.userId}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async editLike(opts: UpdateLike) {//id: number, reviewId: number, userId: number, like: boolean) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(!opts.superEdit) {
					let res = await this.likes.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`EDIT: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.likes.update({like: !!opts.like}, {where: {id: opts.id, reviewId: opts.reviewId, userId: opts.userId}, transaction: t});
				} else {
					await this.likes.update({like: !!opts.like, reviewId: opts.reviewId, userId: opts.userId}, {where: {id: opts.id}, transaction: t});
				}

				return await this.likes.findOne({include: [
					{model: User, attributes: ['id', 'user', 'social_id']},
					{model: Review, attributes: ['id'], include: [{model: TitleGroups, include: [
						{model: Title, attributes: ['id', 'title']},
						{model: Group, attributes: ['id', 'group']}
					]}]}
				], where: {id: opts.id, reviewId: opts.reviewId, userId: opts.userId}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async removeLike(opts: RemoveLike) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.likes.destroy({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.likes.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`REMOVE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.likes.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: (new Date()).toString()}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreLike(opts: RestoreLike) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.likes.restore({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.likes.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`RESTORE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.likes.restore({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: null}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteLike(opts: DeleteLike) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.likes.destroy({where: {id: opts.id}, transaction: t, force: true});
				} else {
					let res = await this.likes.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`DESTROY: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.likes.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t, force: true});
				}
				return {id: opts.id};
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async getLikeAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.likes.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], offset: offset, limit: count, paranoid: !withDeleted});
	}
}
