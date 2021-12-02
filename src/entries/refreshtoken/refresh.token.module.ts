import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {RefreshTokenService} from './refresh.token.service';

import {RefreshToken} from './refresh.token.model';

@Module({
	imports: [
		SequelizeModule.forFeature([RefreshToken]),
	],
	controllers: [],
	providers: [
		RefreshTokenService
	],
	exports: [
		RefreshTokenService
	]
})
export class RefreshTokenModule {}
