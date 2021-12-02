import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {GroupsModule} from '../groups/groups.module';

import {TitlesService} from './titles.service';

import {Title} from './title.model';
import {TitleGroups} from './title.groups.model';
import {Group} from '../groups/group.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Title, TitleGroups, Group]),
		GroupsModule
	],
	controllers: [],
	providers: [
		TitlesService
	],
	exports: [
		TitlesService,
		GroupsModule
	]
})
export class TitlesModule {}
