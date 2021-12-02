import { Sequelize } from 'sequelize-typescript';
import { RefreshToken } from './refresh.token.model';
export declare class RefreshTokenService {
    private sequelize;
    private refreshToken;
    constructor(sequelize: Sequelize, refreshToken: typeof RefreshToken);
    protected hashedToken(token: string): Promise<string>;
    protected compareToken(hash: string, clientToken: string): Promise<boolean>;
    addRefreshToken(userId: number, refreshToken: string, timeLive: number): Promise<boolean>;
    checkRefreshToken(userId: number, refreshToken: string): Promise<boolean>;
    replaceRefreshToken(userId: number, refreshToken: string, timeLive: number): Promise<boolean>;
    deleteRefreshTokenAll(userId: number): Promise<boolean>;
}
