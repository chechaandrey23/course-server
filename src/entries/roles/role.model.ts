import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {User} from '../users/user.model';
import {UserRoles} from '../users/user.roles.model';

interface CreateRole {
	role: number;
	title: string;
	description: string;
}

@Table({tableName: 'roles', timestamps: true, paranoid: true, deletedAt: true})
export class Role extends Model<Role, CreateRole> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.INTEGER, unique: true, allowNull: false})
	role: number;
	
	@Column({type: DataType.STRING, allowNull: false})
	title: string;
	
	@Column({type: DataType.STRING})
	description: string;
	
	@BelongsToMany(() => User, () => UserRoles)
	users: User[];
}
