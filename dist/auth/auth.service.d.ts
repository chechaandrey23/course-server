import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    getCookieWithJwtAccess(id: number, roles: number[]): {
        token: string;
        cookie: string;
    };
    getCookieWithJwtRefresh(id: number, roles: number[]): {
        token: string;
        cookie: string;
    };
    getCookiesForLogOut(): string[];
    getCookieRoles(roles: any): string;
}
