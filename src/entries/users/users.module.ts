import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {UsersService} from './users.service';

import {User} from './user.model';
import {UserRoles} from './user.roles.model';
import {Role} from '../roles/role.model';
import {UserInfo} from '../userinfos/userinfo.model';
import {Theme} from '../themes/theme.model';
import {Lang} from '../langs/lang.model';

@Module({
	imports: [
		SequelizeModule.forFeature([User, UserRoles, Role, UserInfo, Theme, Lang])
	],
	controllers: [],
	providers: [
		UsersService
	],
	exports: [
		UsersService,
	]
})
export class UsersModule {}
