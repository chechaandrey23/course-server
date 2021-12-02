import {Request, Response, NextFunction} from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';

import {RefreshTokenService} from '../../entries/refreshtoken/refresh.token.service';

import {JWT_SECRET_REFRESH} from '../../config';

@Injectable()
export class JwtIsRefreshStrategy extends PassportStrategy(Strategy, 'jwt-is-refresh') {
	constructor(private refreshTokenService:RefreshTokenService) {
		super({
			//jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Refresh;
			}]),
			ignoreExpiration: false,
			secretOrKey: JWT_SECRET_REFRESH,
			passReqToCallback: true
		});
	}
	
	async validate(request: Request, payload: any) {
		return await this.refreshTokenService.checkRefreshToken(payload.id, request.cookies.Refresh)?{id: payload.id, roles: payload.roles}:null;
	}
}
