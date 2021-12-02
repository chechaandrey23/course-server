import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../../entries/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private usersService: UsersService) {
		super();
	}
	
	async validate(username: string, password: string): Promise<any> {
		const user: any = await this.usersService.checkUser(username, password);
		return {id: user.id, roles: user.roles.map((entry) => {return entry.role})};
	}
}
