import {Body, Controller, Get, Post, Param, Query, Request, UseGuards, ConflictException, Redirect} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {RefreshTokenService} from '../entries/refreshtoken/refresh.token.service';
import {UsersService} from '../entries/users/users.service';
import {AuthService} from './auth.service';

import {JWT_SECRET_ACCESS, JWT_ACCESS_EXPIRATION_TIME, JWT_SECRET_REFRESH, JWT_REFRESH_EXPIRATION_TIME} from '../config';

import {JWTAccessAuthGuard} from './guards/jwt.access.auth.guard';
import {JWTRefreshAuthGuard} from './guards/jwt.refresh.auth.guard';
import {JWTIsRefreshAuthGuard} from './guards/jwt.is.refresh.auth.guard';
import {LocalAuthGuard} from './guards/local.auth.guard';
import {GitHubAuthGuard} from './guards/github.auth.guard';

import {UserRoleGuard} from './guards/user.role.guard';
import {EditorRoleGuard} from './guards/editor.role.guard';
import {AdminRoleGuard} from './guards/admin.role.guard';

@Controller('auth/api')
export class AuthController {
	constructor(private refreshTokenService:RefreshTokenService, private authService: AuthService, private usersService: UsersService) {}

	@UseGuards(LocalAuthGuard)
	@Post('/login')
	public async logIn(@Request() req) {
		const user = req.user;

		const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
		const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);

		await this.refreshTokenService.addRefreshToken(user.id, refresh.token, JWT_REFRESH_EXPIRATION_TIME);

		req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);

		return {id: user.id, roles: user.roles, accessToken: access.token}
	}

	public async socialAuth() {}

	@UseGuards(JWTAccessAuthGuard)
	@Post('/logout')
	public async logOut(@Request() req) {
		const user = req.user;

		const cookies = this.authService.getCookiesForLogOut();

		await this.refreshTokenService.deleteRefreshTokenAll(user.id);

		req.res.setHeader('Set-Cookie', cookies);

		return {id: user.id, roles: user.roles};
	}

	@Post('/registration')
	public async registration(@Request() req, @Body('username') username: string, @Body('password') password: string, @Body('password2') password2: string, @Body('email') email: string, @Body('first_name') first_name: string, @Body('last_name') last_name: string) {
		if(password !== password2) throw new ConflictException(`Password and repeated password must be the same`);

		let res: any = await this.usersService.createUser(username, password, email, first_name, last_name);

		res = res.toJSON();

		let user = {id: res.id, roles: res.roles.map((entry) => {return entry.role})};

		const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
		const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);

		await this.refreshTokenService.addRefreshToken(user.id, refresh.token, JWT_REFRESH_EXPIRATION_TIME);

		req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);

		return {id: user.id, roles: user.roles, accessToken: access.token};
	}

	@UseGuards(JWTRefreshAuthGuard)
	@Post('/refresh')
	public async refresh(@Request() req) {
		const user = req.user;

		const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
		const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);

		await this.refreshTokenService.replaceRefreshToken(user.id, req.cookies?.Refresh, refresh.token, JWT_REFRESH_EXPIRATION_TIME);

		req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);

		return {id: user.id, roles: user.roles, accessToken: access.token};
	}

	@UseGuards(GitHubAuthGuard)
	@Get('/github')
	public async authGitHub(@Request() req) {}

	@Redirect('/user', 302)
	@UseGuards(GitHubAuthGuard)
	@Get('/github/callback')
	public async authGitHubCallback(@Request() req) {
		const user = req.user;

		const access = this.authService.getCookieWithJwtAccess(user.id, user.roles);
		const refresh = this.authService.getCookieWithJwtRefresh(user.id, user.roles);

		await this.refreshTokenService.addRefreshToken(user.id, refresh.token, JWT_REFRESH_EXPIRATION_TIME);

		req.res.setHeader('Set-Cookie', [access.cookie, refresh.cookie, this.authService.getCookieRoles(user.roles)]);

		return {id: user.id, roles: user.roles, accessToken: access.token};
	}
}
