import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Role} from './role.model';
import {UserRoles} from '../users/user.roles.model';
import {User} from '../users/user.model';

@Injectable()
export class RolesService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(Role) private roles: typeof Role,
		@InjectModel(User) private users: typeof User,
		@InjectModel(UserRoles) private userRoles: typeof UserRoles
	) {}

	public async createRole(role:number, title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.roles.findOne({where: {role}, transaction: t, paranoid: false});

				if(res) throw new ConflictException({role, title, reason: `Role "${role}(${title})" already exists`});

				let res1 = await this.roles.create({role, title, description}, {transaction: t});

				await this._patchUserRoles(t, res1.id);

				return res1;
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async _patchUserRoles(t: Transaction, roleId: number) {
		let res2 = await this.users.findAll({attributes: ['id'], transaction: t, paranoid: false});

		let newData = res2.map((entry) => {return {userId: entry.getDataValue('id'), roleId}});

		let res3 = await this.userRoles.bulkCreate(newData, {transaction: t});
	}

	public async editRole(id: number, role: number, title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.roles.findOne({where: {[Op.and]: [{role}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});

				if(res) throw new ConflictException({id, role, reason: `Unable to update role uid "${role}(${title})", such a role already exists`});

				await this.roles.update({role, title, description}, {where: {id}, transaction: t});

				return await this.roles.findOne({include: [], where: {id}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async removeRole(id: number) {
		try {
			await this.roles.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async restoreRole(id: number) {
		try {
			await this.roles.restore({where: {id}});
			return {id: id, deletedAt: null}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteRole(id: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.userRoles.destroy({where: {roleId: id}, transaction: t, force: true});
				await this.roles.destroy({where: {id}, transaction: t, force: true});
				return {id: id};
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async getRoleAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.roles.findAll({include: [], offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async getShortRoleAll() {
		return await this.roles.findAll({attributes: ['id', 'role', 'title']});
	}
}
