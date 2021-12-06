import { RefreshTokenService } from '../entries/refreshtoken/refresh.token.service';
import { UsersService } from '../entries/users/users.service';
import { AuthService } from './auth.service';
export declare class AuthController {
    private refreshTokenService;
    private authService;
    private usersService;
    constructor(refreshTokenService: RefreshTokenService, authService: AuthService, usersService: UsersService);
    logIn(req: any): Promise<{
        id: any;
        roles: any;
        accessToken: string;
    }>;
    socialAuth(): Promise<void>;
    logOut(req: any): Promise<{
        id: any;
        roles: any;
    }>;
    registration(req: any, username: string, password: string, password2: string, email: string, first_name: string, last_name: string): Promise<{
        id: any;
        roles: any;
        accessToken: string;
    }>;
    refresh(req: any): Promise<{
        id: any;
        roles: any;
        accessToken: string;
    }>;
    authGitHub(req: any): Promise<void>;
    authGitHubCallback(req: any): Promise<{
        id: any;
        roles: any;
        accessToken: string;
    }>;
    authFaceBook(req: any): Promise<void>;
    authFaceBookCallback(req: any): Promise<{
        id: any;
        roles: any;
        accessToken: string;
    }>;
    authGoogle(req: any): Promise<void>;
    authGoogleCallback(req: any): Promise<{
        id: any;
        roles: any;
        accessToken: string;
    }>;
}
