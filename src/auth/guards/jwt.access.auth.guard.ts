import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class JWTAccessAuthGuard extends AuthGuard('jwt-access') {}
