import {HttpException, HttpStatus, Injectable, Inject, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Comment} from './comment.model';
import {Review} from '../reviews/review.model';
import {User} from '../users/user.model';
import {UserInfo} from '../userinfos/userinfo.model';
import {Title} from '../titles/title.model';
import {Group} from '../groups/group.model';
import {TitleGroups} from '../titles/title.groups.model';

export interface CreateComment {
	reviewId: number;
	userId: number;
	comment: string;
	draft: boolean;
	blocked?: boolean;
	transaction?: Transaction;
}

export interface UpdateComment extends CreateComment {
	id: number;
	superEdit?: boolean;
}

export interface DeleteComment {
	id: number;
	transaction?: Transaction;
	userId?: number;
	superEdit?: boolean;
}

export interface RemoveComment extends DeleteComment {}

export interface RestoreComment extends DeleteComment {}

@Injectable()
export class CommentsService {
	constructor(private sequelize: Sequelize, @InjectModel(Comment) private comments: typeof Comment) {}

	public async createComment(opts: CreateComment) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				let res = await this.comments.create({
					reviewId: opts.reviewId,
					userId: opts.userId,
					comment: opts.comment,
					draft: !!opts.draft,
					blocked: !!opts.blocked
				}, {transaction: t});

				return await this.comments.findOne({include: [
					{model: User, attributes: ['id', 'user', 'social_id'], include: [
						{model: UserInfo, required: false, attributes: ['first_name', 'last_name']},
					]},
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

	public async editComment(opts: UpdateComment) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(!opts.superEdit) {
					let res = await this.comments.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`EDIT: User "${opts.userId}" cannot edit content that is not the creator`);
					if(!!res.blocked) throw new ConflictException(`Comment "${opts.id}" cannot be edited, comment is banned`);
					if(!!res.deletedAt) throw new ConflictException(`Comment "${opts.id}" cannot be edited, comment must be restored!!!`);
				}

				let res = await this.comments.update({
					comment: opts.comment,
					draft: !!opts.draft,
					blocked: !!opts.blocked,
					//reviewId: opts.reviewId,
					//userId: opts.userId,
					...(opts.superEdit?{userId: opts.userId, reviewId: opts.reviewId}:{})
				}, {where: {id: opts.id, ...(opts.superEdit?{}:{userId: opts.userId, reviewId: opts.reviewId})}, transaction: t});

				return await this.comments.findOne({include: [
					{model: User, attributes: ['id', 'user', 'social_id'], include: [
						{model: UserInfo, required: false, attributes: ['first_name', 'last_name']},
					]},
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

	public async removeComment(opts: RemoveComment) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.comments.destroy({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.comments.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`REMOVE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.comments.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: (new Date()).toString()}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreComment(opts: RestoreComment) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.comments.restore({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.comments.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`RESTORE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.comments.restore({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: null}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteComment(opts: DeleteComment) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.comments.destroy({where: {id: opts.id}, transaction: t, force: true});
				} else {
					let res = await this.comments.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`DESTROY: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.comments.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t, force: true});
				}
				return {id: opts.id};
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async getCommentAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.comments.findAll({include: [
			{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted, include: [
				{model: UserInfo, required: false, attributes: ['first_name', 'last_name'], paranoid: !withDeleted},
			]},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async getCommentReviewAll(count: number, offset: number = 0, reviewId: number, isPublic: boolean = true, blocked: boolean = false, withDeleted: boolean = false) {
		return await this.comments.findAll({include: [
			{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted, include: [
				{model: UserInfo, required: false, attributes: ['first_name', 'last_name'], paranoid: !withDeleted},
			]},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], where: {reviewId, draft: !isPublic, blocked}, offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async getAutoUpdateCommentAll(time: number, reviewId: number, isPublic: boolean = true, blocked: boolean = false, withDeleted: boolean = false) {
		const currentDate = Date.now();
		time = time * 1;
		console.log(time, currentDate - time);
		if(currentDate - time >= 30 * 1000) throw new ConflictException('The parameter for auto-update of comments cannot exceed 30 seconds');
		return await this.comments.findAll({include: [
			{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted, include: [
				{model: UserInfo, required: false, attributes: ['first_name', 'last_name'], paranoid: !withDeleted},
			]},
			{model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: !withDeleted, include: [
				{model: Title, attributes: ['id', 'title'], paranoid: !withDeleted},
				{model: Group, attributes: ['id', 'group'], paranoid: !withDeleted}
			]}], paranoid: !withDeleted}], where: {reviewId, draft: !isPublic, blocked, updatedAt: {[Op.gte]: time}}, paranoid: !withDeleted});
	}
}
