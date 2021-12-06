import {PassportStrategy} from '@nestjs/passport';
import {Strategy, VerifyCallback} from 'passport-facebook';
import {Injectable} from '@nestjs/common';

import {UsersService} from '../../entries/users/users.service';

import {FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_CALLBACK_URL} from '../../config';

@Injectable()
export class FaceBookStrategy extends PassportStrategy(Strategy, 'facebook') {
	constructor(private usersService: UsersService) {
		super({
			clientID: FACEBOOK_CLIENT_ID,
			clientSecret: FACEBOOK_CLIENT_SECRET,
			callbackURL: FACEBOOK_CALLBACK_URL,
			//scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any/*, done: VerifyCallback*/): Promise<any> {
		let user: any = await this.usersService.createSocialUser(profile.id, profile.provider, true, profile.displayName);
		user = user.toJSON();
		return {id: user.id, roles: user.roles.map((entry) => {return entry.role})};
	}
}
