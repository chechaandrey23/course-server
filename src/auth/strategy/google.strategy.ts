import {PassportStrategy} from '@nestjs/passport';
import {Strategy, VerifyCallback} from 'passport-google-oauth20';
import {Injectable} from '@nestjs/common';

import {UsersService} from '../../entries/users/users.service';

import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL} from '../../config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private usersService: UsersService) {
		super({
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK_URL,
			scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any/*, done: VerifyCallback*/): Promise<any> {
		let user: any = await this.usersService.createSocialUser(profile.id, profile.provider, true, profile.displayName);
		user = user.toJSON();
		return {id: user.id, roles: user.roles.map((entry) => {return entry.role})};
	}
}
