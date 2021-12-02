import {Request, Response, NextFunction} from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';

import {JWT_SECRET_ACCESS} from '../../config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
	constructor() {
		super({
			//jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Access;
			}]),
			ignoreExpiration: false,
			secretOrKey: JWT_SECRET_ACCESS,
			//passReqToCallback: true
		});
	}
	
	async validate(payload: any) {
		// without query to db!!!
		return {id: payload.id, roles: payload.roles};
	}
}
