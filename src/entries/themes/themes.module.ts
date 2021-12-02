import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ThemesService} from './themes.service';

import {Theme} from './theme.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Theme]),
	],
	controllers: [],
	providers: [
		ThemesService
	],
	exports: [
		ThemesService
	]
})
export class ThemesModule {}
