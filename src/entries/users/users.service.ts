import {HttpException, HttpStatus, Injectable, ConflictException, InternalServerErrorException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';
import * as bcrypt from 'bcryptjs';

import {PASSWORD_SALT_ROUNDS, PASSWORD_SALT_SECRET_1, PASSWORD_SALT_SECRET_2} from '../../config';

import {handlerError} from '../../helpers/handler.error';

import {User} from './user.model';
import {UserRoles} from './user.roles.model';
import {Role} from '../roles/role.model';
import {UserInfo} from '../userinfos/userinfo.model';
import {Theme} from '../themes/theme.model';
import {Lang} from '../langs/lang.model';
import {Like} from '../likes/like.model';

@Injectable()
export class UsersService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(Role) private roles: typeof Role,
		@InjectModel(User) private users: typeof User,
		@InjectModel(UserInfo) private userInfos: typeof UserInfo,
		@InjectModel(Theme) private themes: typeof Theme,
		@InjectModel(Lang) private langs: typeof Lang,
		@InjectModel(UserRoles) private userRoles: typeof UserRoles
	) {}

	protected async hashedPassword(password: string): Promise<string> {
		return await bcrypt.hash(PASSWORD_SALT_SECRET_1 + password + PASSWORD_SALT_SECRET_2, PASSWORD_SALT_ROUNDS);
	}

	protected async comparePassword(hash: string, clientPassword: string): Promise<boolean> {
		return await bcrypt.compare(PASSWORD_SALT_SECRET_1 + clientPassword + PASSWORD_SALT_SECRET_2, hash);
	}

	protected isSelectedRoleNewUser(role) {
		if(role === 0) {// default role guest
			return true;
		} else if(role === 1) {// default role user
			return true;
		} else {
			return false;
		}
	}

	protected getRoleEditorUser() {return 2;}

	protected getRoleUserUser() {return 1;}

	public async createUser(user:string, password:string, email: string, first_name: string = '', last_name: string = '') {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res0 = await this.users.findOne({where: {email}, transaction: t, paranoid: false});

				if(res0) throw new ConflictException({email, reason: `User with email "${email}" already exists`});

				let res = await this.users.findOne({where: {user}, transaction: t, paranoid: false});

				if(res) throw new ConflictException({user, reason: `User "${user}" already exists`});

				let res1 = await this.users.create({user, email, password: await this.hashedPassword(password)}, {transaction: t});

				await this._createUserOther(t, res1.id, [first_name, last_name]);

				return await this.users.findOne({include: [{model: Role, through: { where: { selected: true } }}], attributes: {include: [
					[Sequelize.literal(`(SELECT COUNT(*) FROM "${Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
				], exclude: ['password']}, where: {id: res1.id}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async createSocialUser(social_id:string, vendor: string, softCreate: boolean = false, displayName: string = '') {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				social_id = `${social_id}(${vendor})`;

				let res = await this.users.findOne({where: {social_id}, transaction: t, paranoid: false});

				if(res) {
					if(res.blocked) throw new NotAcceptableException(`User with social id "${social_id}" - is BANNED`);

					if(softCreate) {
						return await this.users.findOne({include: [{model: Role, through: { where: { selected: true } }}], attributes: {include: [
							[Sequelize.literal(`(SELECT COUNT(*) FROM "${Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
						], exclude: ['password']}, where: {id: res.id}, transaction: t});
					} else {
						throw new ConflictException({social_id, reason: `User with social id "${social_id}" already exists`});
					}
				}

				let res1 = await this.users.create({social_id}, {transaction: t});

				const [first_name='', last_name=''] = displayName.split(/\s+/, 2);

				await this._createUserOther(t, res1.id, [first_name, last_name]);

				return await this.users.findOne({include: [{model: Role, through: { where: { selected: true } }}], attributes: {include: [
					[Sequelize.literal(`(SELECT COUNT(*) FROM "${Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
				], exclude: ['password']}, where: {id: res1.id}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async _createUserOther(t: Transaction, userId: number, displayName: string[]) {
		// add roles
		let res2 = await this.roles.findAll({attributes: ['id', 'role'], transaction: t, paranoid: false});

		let newData = res2.map((entry) => {return {
			roleId: entry.getDataValue('id'),
			userId: userId,
			selected: this.isSelectedRoleNewUser(entry.getDataValue('role'))
		}});

		let res3 = await this.userRoles.bulkCreate(newData, {transaction: t});

		// add userInfo
		let entryLang = await this.langs.findOne({attributes: ['id'], transaction: t, paranoid: false});
		if(!entryLang) throw new ConflictException({userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Lang"`});

		let entryTheme = await this.themes.findOne({attributes: ['id'], transaction: t, paranoid: false});
		if(!entryTheme) throw new ConflictException({userId, reason: `Unable to add "UserInfo" entry because no entries exist in "Theme"`});

		let res = await this.userInfos.create({
			userId, langId: entryLang.getDataValue('id'), themeId: entryTheme.getDataValue('id'), first_name: displayName[0], last_name: displayName[1]
		}, {transaction: t});
	}

	public async editUserAdmin(id: number, user:string, social_id:string, email: string, blocked: boolean, activated: boolean, roles: number[]) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let newData = {};

				if(user && user.length > 0) {
					let res = await this.users.findOne({where: {[Op.and]: [{user}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});
					if(res) throw new ConflictException({id, user, reason: `Unable to update user name "${user}", such a user already exists`});
					newData['user'] = user;
				}

				if(social_id && social_id.length > 0) {
					let res = await this.users.findOne({where: {[Op.and]: [{social_id}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});
					if(res) throw new ConflictException({id, social_id, reason: `Unable to update social_id "${social_id}", such a social_id already exists`});
					newData['social_id'] = social_id;
				}

				if(email && email.length > 0) {
					let res = await this.users.findOne({where: {[Op.and]: [{email}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});
					if(res) throw new ConflictException({id, email, reason: `Unable to update email "${email}", such a email already exists`});
					newData['email'] = email;
					newData['activated'] = false;
				}

				await this.userRoles.update({selected: false}, {where: {userId: id}, transaction: t});
				await this.userRoles.update({selected: true}, {where: {userId: id, roleId: {[Op.in]: roles}}, transaction: t});

				let res1 = await this.users.update({...newData, blocked, activated}, {where: {id}, transaction: t});

				return await this.users.findOne({include: [{model: Role, through: { where: { selected: true } }}], attributes: {include: [
					[Sequelize.literal(`(SELECT COUNT(*) FROM "${Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
				],exclude: ['password']}, where: {id}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async changePassword(id: number, prevPassword: string, newPassword: string) {}

	public async removeUser(id: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.userInfos.destroy({where: {userId: id}, transaction: t});
				await this.users.destroy({where: {id}});
				return {id: id, deletedAt: (new Date()).toString()}
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteUser(id: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.userInfos.destroy({where: {userId: id}, transaction: t, force: true});
				await this.userRoles.destroy({where: {userId: id}, transaction: t, force: true});
				await this.users.destroy({where: {id}, transaction: t, force: true});
				return {id: id};
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async checkUser(username: string, password: string) {
		let res = await this.users.findOne({include: [{model: Role, through: { where: { selected: true } }}], where: {user: username}});

		if(!res) throw new NotAcceptableException(`User "${username}" NOT FOUND`);

		if(res.blocked) throw new NotAcceptableException(`User "${username}" - is BANNED`);

		if(!await this.comparePassword(res.password, password)) throw new NotAcceptableException(`Password is INCORRECT`);

		let data: any = res.toJSON();
		delete data.password;

		return data;
	}

	public async checkUserId(id: number) {
		let res = await this.users.findOne({include: [{model: Role, through: { where: { selected: true } }}], where: {id}});

		if(!res) throw new NotAcceptableException(`User (with ID) "${id}" NOT FOUND`);

		if(res.blocked) throw new NotAcceptableException(`User (with ID) "${id}" - is BANNED`);

		let data: any = res.toJSON();
		delete data.password;

		return data;
	}

	public async getUserAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.users.findAll({include: [{model: Role, paranoid: !withDeleted}], attributes: {
			include: [
				[Sequelize.literal(`(SELECT COUNT(*) FROM "${Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
			],
			exclude: ['password']
		}, offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async getUserOne(id: number) {
		return await this.users.findOne({include: [
			{model: UserInfo, include: [{model: Lang}, {model: Theme}]},
			{model: Role, through: { where: { selected: true } }}
		], attributes: {include: [
			[Sequelize.literal(`(SELECT COUNT(*) FROM "${Like.tableName.toString()}" WHERE "like"=true AND "userId"="${this.users.name.toString()}"."id")`), "countUserLike"]
		], exclude: ['password']}, where: {id: id}});
	}

	public async getShortUserAll(count: number, offset: number = 0) {
		return await this.users.findAll({include: [{model: UserInfo, attributes: ['first_name', 'last_name']}], attributes: ['id', 'user', 'social_id'], offset: offset, limit: count})
	}

	public async getShortEditorUserAll(count: number, offset: number = 0) {
		return await this.users.findAll({include: [{model: UserInfo, attributes: ['first_name', 'last_name']}, {model: Role, through: { where: { selected: true } }, where: {role: this.getRoleEditorUser()}, paranoid: false}], attributes: ['id', 'user', 'social_id'], offset: offset, limit: count})
	}

	public async getShortUserUserAll(count: number, offset: number = 0) {
		return await this.users.findAll({include: [{model: UserInfo, attributes: ['first_name', 'last_name']}, {model: Role, through: { where: { selected: true } }, where: {role: this.getRoleUserUser()}, paranoid: false}], attributes: ['id', 'user', 'social_id'], offset: offset, limit: count})
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public async getUserRoleAll(count: number, offset: number = 0) {
		return await this.userRoles.findAll({include: [], offset: offset, limit: count});
	}
}
