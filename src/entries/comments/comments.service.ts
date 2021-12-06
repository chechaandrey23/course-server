import {HttpException, HttpStatus, Injectable, Inject, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op} from "sequelize";

import {handlerError} from '../../helpers/handler.error';

import {Comment} from './comment.model';
import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';
import {Title} from '../titles/title.model';
import {Group} from '../groups/group.model';
import {TitleGroups} from '../titles/title.groups.model';

@Injectable()
export class CommentsService {
	constructor(private sequelize: Sequelize, @InjectModel(Comment) private comments: typeof Comment) {}

	public async createComment(reviewId: number, userId: number, comment: string, draft: boolean, blocked: boolean) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.comments.create({reviewId, userId, comment, draft: !!draft, blocked: !!blocked}, {transaction: t});

				return await this.comments.findOne({include: [
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

	public async editComment(id: number, reviewId: number, userId: number, comment: string, draft: boolean, blocked: boolean) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.comments.update({comment, draft: !!draft, blocked: !!blocked, reviewId, userId}, {where: {id}, transaction: t});
				console.log(res);
				return await this.comments.findOne({include: [
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

	public async removeComment(id: number) {
		try {
			await this.comments.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async restoreComment(id: number) {
		try {
			await this.comments.restore({where: {id}});
			return {id: id, deletedAt: null}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteComment(id: number) {
		try {
			await this.comments.destroy({where: {id}/*, transaction: t*/, force: true});
			return {id: id};
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async getCommentAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.comments.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async getCommentReviewAll(count: number, offset: number = 0, reviewId: number, isPublic: boolean = true, blocked: boolean = false, withDeleted: boolean = false) {
		return await this.comments.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], where: {reviewId, draft: !isPublic, blocked}, offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async getAutoUpdateCommentAll(time: number, reviewId: number, isPublic: boolean = true, blocked: boolean = false, withDeleted: boolean = false) {
		const currentDate = Date.now();
		if(currentDate - time >= 30 * 1000) throw new ConflictException('The parameter for auto-update of comments cannot exceed 30 seconds');
		return await this.comments.findAll({include: [{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], where: {reviewId, draft: !isPublic, blocked, createdAt: {[Op.gte]: time}}, paranoid: !withDeleted});
	}
}
