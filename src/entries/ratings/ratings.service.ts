import {HttpException, HttpStatus, Injectable, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';

import {handlerError} from '../../helpers/handler.error';

import {Rating} from './rating.model';
import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';
import {Title} from '../titles/title.model';
import {Group} from '../groups/group.model';
import {TitleGroups} from '../titles/title.groups.model';

@Injectable()
export class RatingsService {
	constructor(private sequelize: Sequelize, @InjectModel(Rating) private ratings: typeof Rating) {}
	
	public async createRating(reviewId: number, userId: number, rating: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res0 = await this.ratings.findOne({where: {reviewId, userId}, transaction: t})
				
				if(res0) throw new ConflictException({reviewId, userId, reason: `User (userId: ${userId} / reviewId: ${reviewId}) can vote only once`});
				
				let res = await this.ratings.create({reviewId, userId, userRating: rating}, {transaction: t});
				
				return await this.ratings.findOne({include: [
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
	
	public async editRating(id: number, reviewId: number, userId: number, rating: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.ratings.update({userRating: rating, reviewId, userId}, {where: {id}, transaction: t});
				
				return await this.ratings.findOne({include: [
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
	
	public async removeRating(id: number) {
		try {
			await this.ratings.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async deleteRating(id: number) {
		try {
			await this.ratings.destroy({where: {id}/*, transaction: t*/, force: true});
			return {id: id};
		} catch(e) {
			handlerError(e, {id});
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
