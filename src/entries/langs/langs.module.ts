import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {LangsService} from './langs.service';

import {Lang} from './lang.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Lang]),
	],
	controllers: [],
	providers: [
		LangsService
	],
	exports: [
		LangsService
	]
})
export class LangsModule {}
