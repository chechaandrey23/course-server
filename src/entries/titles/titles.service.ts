import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Title} from './title.model';
import {TitleGroups} from './title.groups.model';
import {Group} from '../groups/group.model';

@Injectable()
export class TitlesService {
	constructor(private sequelize: Sequelize, 
		@InjectModel(Title) private titles: typeof Title, 
		@InjectModel(Group) private groups: typeof Group, 
		@InjectModel(TitleGroups) private titleGroups: typeof TitleGroups) {}
	
	public async createTitle(title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.titles.findOne({where: {title}, transaction: t, paranoid: false});
				
				if(res) throw new ConflictException({title, reason: `Title "${title}" already exists`});
				
				let res1 = await this.titles.create({title, description}, {transaction: t});
				
				await this._patchTitleGroups(t, res1.id);
				
				return res1;
			});
		} catch(e) {
			handlerError(e);
		}
	}
	
	public async _patchTitleGroups(t: Transaction, titleId: number) {
		let res2 = await this.groups.findAll({attributes: ['id'], transaction: t, paranoid: false});
		
		let newData = res2.map((entry) => {return {groupId: entry.getDataValue('id'), titleId}});
		
		let res3 = await this.titleGroups.bulkCreate(newData, {transaction: t});
	}
	
	public async editTitle(id: number, title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.titles.findOne({where: {[Op.and]: [{title}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});
				
				if(res) throw new ConflictException({id, title, reason: `Unable to update title name "${title}", such a title already exists`});
				
				await this.titles.update({title, description}, {where: {id}, transaction: t});
				
				return await this.titles.findOne({include: [], where: {id}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async removeTitle(id: number) {
		try {
			await this.titles.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async deleteTitle(id: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.titleGroups.destroy({where: {titleId: id}, transaction: t, force: true});
				await this.titles.destroy({where: {id}, transaction: t, force: true});
				return {id: id};
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async getTitleAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.titles.findAll({include: [], offset: offset, limit: count, paranoid: !withDeleted});
	}
	
	public async getShortTitleAll(count: number, offset: number = 0) {
		return await this.titles.findAll({attributes: ['id', 'title'], offset: offset, limit: count});
	}
	
	public async getPartTitleAll(count: number, offset: number = 0, query: string) {
		return await this.titles.findAll({attributes: ['id', 'title'], offset: offset, limit: count, where: {title: {
			[Op.substring]: query
		}}});
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	public async getTitleGroupAll(count: number, offset: number = 0) {
		return await this.titleGroups.findAll({include: [], offset: offset, limit: count});
	}
}
