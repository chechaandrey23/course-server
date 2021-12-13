import {HttpException, HttpStatus, Injectable, NotAcceptableException, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from "sequelize";

import {handlerError} from '../../helpers/handler.error';

import {UserInfo} from './userinfo.model';
import {Theme} from '../themes/theme.model';
import {Lang} from '../langs/lang.model';
import {User} from '../users/user.model';

export interface CreateUserInfo {
	userId: number;
	transaction?: Transaction;
}

export interface UpdateUserInfo {
	id: number;
	superEdit?: boolean;
	userId: number;
	transaction?: Transaction;
	first_name:string;
	last_name:string;
	themeId: number;
	langId: number;
}

export interface DeleteUserInfo {
	id: number;
	transaction?: Transaction;
	userId?: number;
	superEdit?: boolean;
}

export interface RemoveUserInfo extends DeleteUserInfo {}

export interface RestoreUserInfo extends DeleteUserInfo {}

@Injectable()
export class UserInfosService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(UserInfo) private userInfos: typeof UserInfo,
		@InjectModel(Theme) private themes: typeof Theme,
		@InjectModel(Lang) private langs: typeof Lang,
		@InjectModel(User) private users: typeof User
	) {}

	public async createUserInfo(opts: CreateUserInfo) {
		try {
			const transaction = opts.transaction;
			const userId = opts.userId;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				let entryLang = await this.langs.findOne({attributes: ['id'], transaction: t, paranoid: false});
				if(!entryLang) throw new ConflictException({userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Lang"`});

				let entryTheme = await this.themes.findOne({attributes: ['id'], transaction: t, paranoid: false});
				if(!entryTheme) throw new ConflictException({userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Theme"`});

				let entryUser = await this.users.findOne({where: {id: userId}, transaction: t, paranoid: false});
				if(!entryUser) throw new ConflictException({userId, reason: `Unable to add "UserInfo" entry because user "${userId}" does not exist`});

				let res = await this.userInfos.create({userId, langId: entryLang.getDataValue('id'), themeId: entryTheme.getDataValue('id')}, {transaction: t});

				return await this.userInfos.findOne({
					include: [Lang, Theme, {model: User, attributes: ['id', 'user', 'social_id']}],
					where: {id: res.getDataValue('id')}, transaction: t
				});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async editUserInfo(opts: UpdateUserInfo) {//id: number, userId:number, first_name:string, last_name:string, themeId: number, langId: number) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(!opts.superEdit) {
					let res = await this.userInfos.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`EDIT: User "${opts.userId}" cannot edit content that is not the creator`);
				}

				await this.userInfos.update({
					//userId,
					...(opts.superEdit?{userId: opts.userId}:{}),
					first_name: opts.first_name,
					last_name: opts.last_name,
					themeId: opts.themeId,
					langId: opts.langId
				}, {where: {id: opts.id, ...(opts.superEdit?{}:{userId: opts.userId})}, transaction: t});

				return await this.userInfos.findOne({
					include: [Lang, Theme, {model: User, attributes: ['id', 'user', 'social_id']}],
					where: {id: opts.id}, transaction: t
				});
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async removeUserInfo(opts: RemoveUserInfo) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.userInfos.destroy({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.userInfos.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`REMOVE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.userInfos.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: (new Date()).toString()}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreUserInfo(opts: RestoreUserInfo) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.userInfos.restore({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.userInfos.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`RESTORE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.userInfos.restore({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: null}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteUserInfo(opts: DeleteUserInfo) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.userInfos.destroy({where: {id: opts.id}, transaction: t, force: true});
				} else {
					let res = await this.userInfos.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`DESTROY: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.userInfos.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t, force: true});
				}
				return {id: opts.id};
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async getUserInfoAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.userInfos.findAll({include: [
				{model: Lang, paranoid: !withDeleted},
				{model: Theme, paranoid: !withDeleted},
				{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted}], offset: offset, limit: count, paranoid: !withDeleted
		});
	}
}
