import {BelongsToMany, BelongsTo, Column, DataType, HasMany, Model, Table, ForeignKey} from "sequelize-typescript";

import {User} from "./user.model";
import {Role} from "../roles/role.model";

interface CreateUserRole {
	roleId: number;
	userId: number;
}

@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})
export class UserRoles extends Model<UserRoles, CreateUserRole> {
	@ForeignKey(() => Role)
	@Column({type: DataType.INTEGER})
	roleId: number;
	
	@ForeignKey(() => User)
	@Column({type: DataType.INTEGER})
	userId: number;
	
	@BelongsTo(() => User)
	user: User
	
	@Column({type: DataType.BOOLEAN, defaultValue: false})
	selected: boolean;
	
	@BelongsTo(() => Role)
	role: Role
}
