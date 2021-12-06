import {HttpException, HttpStatus, Injectable, Inject, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {Like} from './like.model';
import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';
import {Title} from '../titles/title.model';
import {Group} from '../groups/group.model';
import {TitleGroups} from '../titles/title.groups.model';

@Injectable()
export class LikesService {
	constructor(private sequelize: Sequelize, @InjectModel(Like) private likes: typeof Like) {}

	public async createLike(reviewId: number, userId: number, like: boolean) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res0 = await this.likes.findOne({where: {reviewId, userId}, transaction: t})

				if(res0) throw new ConflictException({reviewId, userId, reason: `User (userId: ${userId} / reviewId: ${reviewId}) can like only once`});

				let res = await this.likes.create({reviewId, userId, like: !!like}, {transaction: t});

				return await this.likes.findOne({include: [
					{model: User, attributes: ['id', 'user', 'social_id']},
					{model: Review, attributes: ['id'], include: [{model: TitleGroups, include: [
						{model: Title, attributes: ['id', 'title']},
						{model: Group, attributes: ['id', 'group']}
					]}]}
				], where: {id: res.getDataValue('id'), reviewId, userId}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async editLike(id: number, reviewId: number, userId: number, like: boolean) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.likes.update({like: !!like, reviewId, userId}, {where: {id}, transaction: t});

				return await this.likes.findOne({include: [
					{model: User, attributes: ['id', 'user', 'social_id']},
					{model: Review, attributes: ['id'], include: [{model: TitleGroups, include: [
						{model: Title, attributes: ['id', 'title']},
						{model: Group, attributes: ['id', 'group']}
					]}]}
				], where: {id, reviewId, userId}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async removeLike(id: number) {
		try {
			await this.likes.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async restoreLike(id: number) {
		try {
			await this.likes.restore({where: {id}});
			return {id: id, deletedAt: null}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteLike(id: number) {
		try {
			await this.likes.destroy({where: {id}/*, transaction: t*/, force: true});
			return {id: id};
		} catch(e) {
			handlerError(e, {id});
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
