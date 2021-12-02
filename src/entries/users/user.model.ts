import {BelongsToMany, HasOne, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {UserRoles} from './user.roles.model';
import {Role} from '../roles/role.model';
import {UserInfo} from '../userinfos/userinfo.model';
//import {Like} from '../likes/like.model';

interface CreateUser {
	password: string;
	user: string;
	email: string
}

interface CreateSocialUser {
	social_id: string;
}

@Table({tableName: 'users', timestamps: true, paranoid: true, deletedAt: true})
export class User extends Model<User, CreateUser|CreateSocialUser> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING, unique: true})
	user: string;
	
	@Column({type: DataType.STRING})
	password: string;
	
	@Column({type: DataType.STRING, unique: true})
	social_id: string;
	
	@Column({type: DataType.STRING, unique: true})
	email: string;
	
	@Column({type: DataType.BOOLEAN, defaultValue: false})
	blocked: boolean;
	
	@Column({type: DataType.BOOLEAN, defaultValue: false})
	activated: boolean;
	
	@BelongsToMany(() => Role, () => UserRoles)
	roles: Role[];
	
	@HasOne(() => UserInfo)
	userInfo: UserInfo
	
	//@HasMany(() => Like)
	//likes: Like[];
}
