import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {RolesService} from './roles.service';

import {Role} from './role.model';
import {User} from '../users/user.model';
import {UserRoles} from '../users/user.roles.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Role, User, UserRoles]),
	],
	controllers: [],
	providers: [
		RolesService
	],
	exports: [
		RolesService
	]
})
export class RolesModule {}
