import { Strategy } from 'passport-local';
import { UsersService } from '../../entries/users/users.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(username: string, password: string): Promise<any>;
}
export {};
