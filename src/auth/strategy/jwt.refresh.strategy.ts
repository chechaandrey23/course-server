import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {Request} from 'express';

import {UsersService} from '../../entries/users/users.service';

import {JWT_SECRET_ACCESS, JWT_ACCESS_EXPIRATION_TIME, JWT_SECRET_REFRESH, JWT_REFRESH_EXPIRATION_TIME} from '../../config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private usersService: UsersService) {
		super({
			//jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
			//	return request?.cookies?.Refresh;
			//}]),
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Refresh;
			}]),
			ignoreExpiration: false,
			secretOrKey: JWT_SECRET_REFRESH,
			//passReqToCallback: true,
		});
	}

	async validate(payload: any) {
		const user: any = await this.usersService.checkUserId(payload.id);
		return {id: user.id, roles: user.roles.map((entry) => {return entry.role})};
	}
}
