import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {GroupsService} from './groups.service';

import {Group} from './group.model';
import {TitleGroups} from '../titles/title.groups.model';
import {Title} from '../titles/title.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Group, TitleGroups, Title]),
	],
	controllers: [],
	providers: [
		GroupsService
	],
	exports: [
		GroupsService
	]
})
export class GroupsModule {}
