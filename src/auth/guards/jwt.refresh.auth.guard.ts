import {Injectable, UnauthorizedException, HttpException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class JWTRefreshAuthGuard extends AuthGuard('jwt-refresh') {
	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		if(err) throw new HttpException(err.message, err.status);
		if(!user) {
			context.getResponse().setHeader('Set-Cookie', [
				'Access=; HttpOnly; Path=/; Max-Age=0',
				'Refresh=; HttpOnly; Path=/; Max-Age=0',
				'Roles=; Path=/; Max-Age=0'
			]);
			throw new UnauthorizedException(info.message);
		}
		return user;
	}
}
