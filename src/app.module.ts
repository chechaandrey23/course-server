import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {SequelizeModule} from "@nestjs/sequelize";

import * as path from 'path';

import {AuthModule} from './auth/auth.module';
import {AdminModule} from './admin/admin.module';
import {UserModule} from './user/user.module';
import {EditorModule} from './editor/editor.module';
import {GuestModule} from './guest/guest.module';
import {FinalModule} from './final/final.module';

import {SEQUELIZE_POSTGRES_CONFIG} from './config';

@Module({
	imports: [
		AuthModule,
		AdminModule,
		UserModule,
		EditorModule,
		GuestModule,
		//SequelizeModule.forRoot(SEQUELIZE_POSTGRES_CONFIG),
		SequelizeModule.forRoot(SEQUELIZE_POSTGRES_CONFIG),
		FinalModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
