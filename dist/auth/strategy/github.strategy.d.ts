import { UsersService } from '../../entries/users/users.service';
declare const GitHubStrategy_base: new (...args: any[]) => any;
export declare class GitHubStrategy extends GitHubStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
