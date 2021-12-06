import {HttpException, HttpStatus, Injectable, NotAcceptableException, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {UserInfo} from './userinfo.model';
import {Theme} from '../themes/theme.model';
import {Lang} from '../langs/lang.model';
import {User} from '../users/user.model';

@Injectable()
export class UserInfosService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(UserInfo) private userInfos: typeof UserInfo,
		@InjectModel(Theme) private themes: typeof Theme,
		@InjectModel(Lang) private langs: typeof Lang,
		@InjectModel(User) private users: typeof User
	) {}

	public async createUserInfo(userId:number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
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

	public async editUserInfo(id: number, userId:number, first_name:string, last_name:string, themeId: number, langId: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.userInfos.update({userId, first_name, last_name, themeId, langId}, {where: {id}, transaction: t});

				return await this.userInfos.findOne({
					include: [Lang, Theme, {model: User, attributes: ['id', 'user', 'social_id']}],
					where: {id}, transaction: t
				});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async removeUserInfo(id: number) {
		try {
			await this.userInfos.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async restoreUserInfo(id: number) {
		try {
			await this.userInfos.restore({where: {id}});
			return {id: id, deletedAt: null}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteUserInfo(id: number) {
		try {
			await this.userInfos.destroy({where: {id}, force: true});
			return {id: id};
		} catch(e) {
			handlerError(e, {id});
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
