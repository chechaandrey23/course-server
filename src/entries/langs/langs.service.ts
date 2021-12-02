import {HttpException, HttpStatus, Injectable, NotAcceptableException, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Lang} from './lang.model';

@Injectable()
export class LangsService {
	constructor(private sequelize: Sequelize, @InjectModel(Lang) private langs: typeof Lang) {}
	
	public async createLang(lang:string, title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.langs.findOne({where: {lang}, transaction: t, paranoid: false});
				
				if(res) throw new ConflictException({lang, title, reason: `Lang "${lang}(${title})" already exists`});
				
				return await this.langs.create({lang, title, description}, {transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}
	
	public async editLang(id: number, lang: string, title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.langs.findOne({where: {[Op.and]: [{lang}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});
				
				if(res) throw new ConflictException({id, lang, title, reason: `Unable to update lang "${lang}(${title})", such a lang already exists`});
				
				await this.langs.update({lang, title, description}, {where: {id}, transaction: t});
				
				return await this.langs.findOne({include: [], where: {id}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async removeLang(id: number) {
		try {
			await this.langs.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async deleteLang(id: number) {
		try {
			await this.langs.destroy({where: {id}, force: true});
			return {id: id};
		} catch(e) {
			handlerError(e, {id});
		}
	}
	
	public async getLangAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.langs.findAll({include: [], offset: offset, limit: count, paranoid: !withDeleted});
	}
	
	public async getShortLangAll() {
		return await this.langs.findAll({attributes: ['id', 'lang', 'title']});
	}
}
