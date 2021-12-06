import {HttpException, HttpStatus, Injectable, Inject, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';
import * as bcrypt from 'bcryptjs';

import {handlerError} from '../../helpers/handler.error';

import {RefreshToken} from './refresh.token.model';
import {User} from '../users/user.model';

import {REFRESH_TOKEN_SALT_ROUNDS, REFRESH_TOKEN_SALT_SECRET_1, REFRESH_TOKEN_SALT_SECRET_2} from '../../config';

@Injectable()
export class RefreshTokenService {
	constructor(private sequelize: Sequelize, @InjectModel(RefreshToken) private refreshToken: typeof RefreshToken) {}

	protected async hashedToken(token: string): Promise<string> {
		return await bcrypt.hash(REFRESH_TOKEN_SALT_SECRET_1 + token + REFRESH_TOKEN_SALT_SECRET_2, REFRESH_TOKEN_SALT_ROUNDS);
	}

	protected async compareToken(hash: string, clientToken: string): Promise<boolean> {
		return await bcrypt.compare(REFRESH_TOKEN_SALT_SECRET_1 + clientToken + REFRESH_TOKEN_SALT_SECRET_2, hash);
	}

	public async addRefreshToken(userId: number, refreshToken: string, timeLive: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.refreshToken.findOne({where: {userId}, transaction: t});

				if(!res) {
					await this.refreshToken.create({userId, RT1: await this.hashedToken(refreshToken), dateEndRT1: Date.now() + timeLive}, {transaction: t});
				} else {
					await this.refreshToken.update({RT1: await this.hashedToken(refreshToken), dateEndRT1: Date.now() + timeLive}, {where: {userId}, transaction: t});
				}

				return true;
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async checkRefreshToken(userId: number, refreshToken: string) {
		try {
			let res = await this.refreshToken.findOne({where: {userId}});

			if(!res) return false;

			return await this.compareToken(res.RT1, refreshToken);
		} catch(e) {
			handlerError(e);
		}
	}

	public async replaceRefreshToken(userId: number, refreshToken: string, newRefreshToken: string, timeLive: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.refreshToken.findOne({where: {userId}, transaction: t});

				if(!res) throw new NotAcceptableException(`Unable to update refresh token for user id "${userId}"`);

				if(!res.RT1 || !await this.compareToken(res.RT1, refreshToken)) throw new NotAcceptableException(`Invalid refresh token provided`);

				await this.refreshToken.update({RT1: await this.hashedToken(newRefreshToken), dateEndRT1: Date.now() + timeLive}, {where: {userId}, transaction: t});

				return true;
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async deleteRefreshTokenAll(userId: number) {
		try {
			this.refreshToken.update({RT1: null, dateEndRT1: null}, {where: {userId}});

			return true;
		} catch(e) {
			handlerError(e);
		}
	}

	public async refreshTokenGetAll(count: number, offset: number = 0, withDeleted: boolean = false) {
		return this.refreshToken.findAll({attributes: {exclude: ['RT1']}, include: [
			{model: User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted}
		], offset: offset, limit: count, paranoid: !withDeleted});
	}

	public async refreshTokenDelete(id: number) {
		try {
			await this.refreshToken.destroy({where: {id}/*, transaction: t*/, force: true});
			return {id: id};
		} catch(e) {
			handlerError(e, {id});
		}
	}
}
