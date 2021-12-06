import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Theme} from './theme.model';

@Injectable()
export class ThemesService {
	constructor(private sequelize: Sequelize, @InjectModel(Theme) private themes: typeof Theme) {}

	public async createTheme(theme:string, title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.themes.findOne({where: {theme}, transaction: t, paranoid: false});

				if(res) throw new ConflictException({theme, title, reason: `Theme "${theme}(${title})" already exists`});

				return await this.themes.create({theme, title, description}, {transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async editTheme(id: number, theme: string, title:string, description: string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.themes.findOne({where: {[Op.and]: [{theme}, {id: {[Op.ne]: id}}]}, transaction: t, paranoid: false});

				if(res) throw new ConflictException({id, theme, title, reason: `Unable to update theme "${theme}(${title})", such a theme already exists`});

				await this.themes.update({theme, title, description}, {where: {id}, transaction: t});

				return await this.themes.findOne({include: [], where: {id}, transaction: t});
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async removeTheme(id: number) {
		try {
			await this.themes.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async restoreTheme(id: number) {
		try {
			await this.themes.restore({where: {id}});
			return {id: id, deletedAt: null}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteTheme(id: number) {
		try {
			await this.themes.destroy({where: {id}, force: true});
			return {id: id};
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async getThemeAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return await this.themes.findAll({include: [], offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async getShortThemeAll() {
		return await this.themes.findAll({attributes: ['id', 'theme', 'title']});
	}
}
