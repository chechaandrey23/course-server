import {ConflictException, NotAcceptableException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Group} from './group.model';
import {TitleGroups} from '../titles/title.groups.model';
import {Title} from '../titles/title.model';

@Injectable()
export class GroupsService {
	constructor(
		private sequelize: Sequelize, 
		@InjectModel(Group) private groups: typeof Group, 
		@InjectModel(Title) private titles: typeof Title, 
		@InjectModel(TitleGroups) private titleGroups: typeof TitleGroups
	) {}
	
	public async createGroup(group:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.groups.findOne({where: {group}, transaction: t, paranoid: false});
				
				if(res) throw new ConflictException({group, reason: `Group "${group}" already exists`});
				
				let res1 = await this.groups.create({group, description}, {transaction: t});
				
				await this._patchTitleGroups(t, res1.id);
				
				return res1;
			});
		} catch(e) {
			handlerError(e);
		}
	}
	
	public async _patchTitleGroups(t: Transaction, groupId: number) {
		let res2 = await this.titles.findAll({attributes: ['id'], transaction: t, paranoid: false});
		
		let newData = res2.map((entry) => {return {titleId: entry.getDataValue('id'), groupId}});
		
		let res3 = await this.titleGroups.bulkCreate(newData, {transaction: t});
	}
	
	public async editGroup(id: number, group:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.groups.findOne({where: {[Op.and]: [{group}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});
				
				if(res) throw new ConflictException({id, group, reason: `Unable to update group name "${group}", such a group already exists`});
				
				await this.groups.update({group, description}, {where: {id}, transaction: t});
				
				return await this.groups.findOne({include: [], where: {id}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async removeGroup(id: number) {
		try {
			await this.groups.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()};
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async deleteGroup(id: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.titleGroups.destroy({where: {groupId: id}, transaction: t, force: true});
				await this.groups.destroy({where: {id}, transaction: t, force: true});
				return {id: id};
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async getGroupAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.groups.findAll({include: [], offset: offset, limit: count, paranoid: !withDeleted});
	}
	
	public async getShortGroupAll() {
		return await this.groups.findAll({attributes: ['id', 'group']});
	}
}
