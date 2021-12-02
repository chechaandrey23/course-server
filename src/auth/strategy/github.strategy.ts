import {PassportStrategy} from '@nestjs/passport';
import {Strategy, VerifyCallback} from 'passport-github';
import { Injectable } from '@nestjs/common';

import {UsersService} from '../../entries/users/users.service';

import {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL} from '../../config';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
	constructor(private usersService: UsersService) {
		super({
			clientID: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			callbackURL: GITHUB_CALLBACK_URL,
			scope: ['email', 'profile'],
		});
	}
	
	async validate(accessToken: string, refreshToken: string, profile: any/*, done: VerifyCallback*/): Promise<any> {
		let user: any = await this.usersService.createSocialUser(profile.id, profile.provider, true, profile.displayName);
		user = user.toJSON();
		return {id: user.id, roles: user.roles.map((entry) => {return entry.role})};
	}
}
