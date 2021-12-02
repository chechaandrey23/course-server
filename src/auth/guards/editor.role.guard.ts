import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

@Injectable()
export class EditorRoleGuard implements CanActivate {
	public readonly role: number = 2;
	
	constructor(private reflector: Reflector) {}
	
	canActivate(context: ExecutionContext): boolean {
		//const roles = this.reflector.get<string[]>('roles', context.getHandler());
		//if(!roles) return true;
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		return user.roles.includes(this.role);
	}
}
