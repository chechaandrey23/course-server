import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ThemesModule} from '../themes/themes.module';
import {LangsModule} from '../langs/langs.module';

import {UserInfosService} from './userinfos.service';

import {UserInfo} from './userinfo.model';
import {Theme} from '../themes/theme.model';
import {Lang} from '../langs/lang.model';
import {User} from '../users/user.model';

@Module({
	imports: [
		SequelizeModule.forFeature([UserInfo, Theme, Lang, User])
	],
	controllers: [],
	providers: [
		UserInfosService
	],
	exports: [
		UserInfosService
	]
})
export class UserInfosModule {}
