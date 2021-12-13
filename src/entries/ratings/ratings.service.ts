import {HttpException, HttpStatus, Injectable, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Op, Transaction} from "sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {Rating} from './rating.model';
import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';
import {Title} from '../titles/title.model';
import {Group} from '../groups/group.model';
import {TitleGroups} from '../titles/title.groups.model';

export interface CreateRating {
	userId: number;
	transaction?: Transaction;
	reviewId: number;
	rating: number;
}

export interface UpdateRating extends CreateRating {
	id: number;
	superEdit?: boolean;
}

export interface DeleteRating {
	id: number;
	transaction?: Transaction;
	userId?: number;
	superEdit?: boolean;
}

export interface RemoveRating extends DeleteRating {}

export interface RestoreRating extends DeleteRating {}

@Injectable()
export class RatingsService {
	constructor(private sequelize: Sequelize, @InjectModel(Rating) private ratings: typeof Rating) {}

	public async createRating(opts: CreateRating) {//reviewId: number, userId: number, rating: number) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				let res0 = await this.ratings.findOne({where: {reviewId: opts.reviewId, userId: opts.userId}, transaction: t});

				if(res0) throw new ConflictException({
					reviewId: opts.reviewId, userId: opts.userId, reason: `User (userId: ${opts.userId} / reviewId: ${opts.reviewId}) can vote only once`
				});

				let res = await this.ratings.create({reviewId: opts.reviewId, userId: opts.userId, userRating: opts.rating}, {transaction: t});

				return await this.ratings.findOne({include: [
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

	public async editRating(opts: UpdateRating) {//id: number, reviewId: number, userId: number, rating: number) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(!opts.superEdit) {
					let res = await this.ratings.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`EDIT: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.ratings.update({userRating: opts.rating}, {where: {id: opts.id, reviewId: opts.reviewId, userId: opts.userId}, transaction: t});
				} else {
					await this.ratings.update({userRating: opts.rating, reviewId: opts.reviewId, userId: opts.userId}, {where: {id: opts.id}, transaction: t});
				}

				return await this.ratings.findOne({include: [
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

	public async removeRating(opts: RemoveRating) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.ratings.destroy({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.ratings.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`REMOVE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.ratings.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: (new Date()).toString()}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreRating(opts: RestoreRating) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.ratings.restore({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.ratings.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`RESTORE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.ratings.restore({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: null}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteRating(opts: DeleteRating) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.ratings.destroy({where: {id: opts.id}, transaction: t, force: true});
				} else {
					let res = await this.ratings.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`DESTROY: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.ratings.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t, force: true});
				}
				return {id: opts.id};
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async getRatingAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.ratings.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], offset: offset, limit: count, paranoid: !withDeleted});
	}
}
