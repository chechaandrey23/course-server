import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';

import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';

import {UsersModule} from '../entries/users/users.module';
import {RefreshTokenModule} from '../entries/refreshtoken/refresh.token.module';

import {LocalStrategy} from './strategy/local.strategy';
import {JwtAccessStrategy} from './strategy/jwt.access.strategy';
import {JwtRefreshStrategy} from './strategy/jwt.refresh.strategy';
import {JwtIsRefreshStrategy} from './strategy/jwt.is.refresh.strategy';
import {GitHubStrategy} from './strategy/github.strategy';
import {FaceBookStrategy} from './strategy/facebook.strategy';
import {GoogleStrategy} from './strategy/google.strategy';

@Module({
	imports: [
		RefreshTokenModule,
		UsersModule,
		PassportModule,
		JwtModule.register({
			//secret: JWT_SECRET_TOKEN,
			//signOptions: {expiresIn: '60s'},
		}),
	],
	controllers: [
		AuthController
	],
	providers: [
		LocalStrategy,
		AuthService,
		JwtAccessStrategy,
		JwtRefreshStrategy,
		JwtIsRefreshStrategy,
		GitHubStrategy,
		FaceBookStrategy,
		GoogleStrategy
	],
	exports: [
		AuthService
	]
})
export class AuthModule {}
