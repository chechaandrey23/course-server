import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { RefreshTokenService } from '../../entries/refreshtoken/refresh.token.service';
declare const JwtIsRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtIsRefreshStrategy extends JwtIsRefreshStrategy_base {
    private refreshTokenService;
    constructor(refreshTokenService: RefreshTokenService);
    validate(request: Request, payload: any): Promise<{
        id: any;
        roles: any;
    }>;
}
export {};
