declare const JWTRefreshAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JWTRefreshAuthGuard extends JWTRefreshAuthGuard_base {
    handleRequest(err: any, user: any, info: any, context: any, status: any): any;
}
export {};
