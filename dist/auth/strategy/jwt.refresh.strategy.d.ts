import { Strategy } from 'passport-jwt';
import { UsersService } from '../../entries/users/users.service';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: any): Promise<{
        id: any;
        roles: any;
    }>;
}
export {};
