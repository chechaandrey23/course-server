import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class JWTIsRefreshAuthGuard extends AuthGuard('jwt-is-refresh') {}
