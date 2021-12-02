import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {RatingsService} from './ratings.service';

import {Rating} from './rating.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Rating]),
	],
	controllers: [],
	providers: [
		RatingsService
	],
	exports: [
		RatingsService
	]
})
export class RatingsModule {}
