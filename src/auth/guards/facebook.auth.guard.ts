import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class FaceBookAuthGuard extends AuthGuard('facebook') {}
