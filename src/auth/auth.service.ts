import {ConflictException, NotAcceptableException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {JwtService} from '@nestjs/jwt';

import {JWT_SECRET_ACCESS, JWT_ACCESS_EXPIRATION_TIME, JWT_SECRET_REFRESH, JWT_REFRESH_EXPIRATION_TIME} from '../config';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService
	) {}
	
	
	public getCookieWithJwtAccess(id: number, roles: number[]) {
		const payload: any = {id, roles};
		const token = this.jwtService.sign(payload, {
			secret: JWT_SECRET_ACCESS,
			expiresIn: JWT_ACCESS_EXPIRATION_TIME
		});
		return {
			token,
			cookie: `Access=${token}; HttpOnly; Path=/; Max-Age=${Math.round(JWT_ACCESS_EXPIRATION_TIME/1000)}`
		};
	}
	
	public getCookieWithJwtRefresh(id: number, roles: number[]) {
		const payload: any = {id, roles};
		const token = this.jwtService.sign(payload, {
			secret: JWT_SECRET_REFRESH,
			expiresIn: JWT_REFRESH_EXPIRATION_TIME
		});
		return {
			token,
			cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=${Math.round(JWT_REFRESH_EXPIRATION_TIME/1000)}`
		};
	}
	
	public getCookiesForLogOut() {
		return [
			'Access=; HttpOnly; Path=/; Max-Age=0',
			'Refresh=; HttpOnly; Path=/; Max-Age=0',
			'Roles=; Path=/; Max-Age=0'
		]
	}
	
	public getCookieRoles(roles) {
		return `Roles=${JSON.stringify(roles)}; Path=/;`;
	}
}
