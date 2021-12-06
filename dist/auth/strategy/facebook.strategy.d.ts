import { UsersService } from '../../entries/users/users.service';
declare const FaceBookStrategy_base: new (...args: any[]) => any;
export declare class FaceBookStrategy extends FaceBookStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
