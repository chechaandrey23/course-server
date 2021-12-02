import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class EditorRoleGuard implements CanActivate {
    private reflector;
    readonly role: number;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
