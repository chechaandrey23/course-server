import {BelongsTo, ForeignKey, HasOne, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {User} from '../users/user.model';

interface CreateToken {
	userId: number;
	dateEndRT1: number;
	RT1: string;
}

@Table({tableName: 'refresh_token', timestamps: true, paranoid: true, deletedAt: true})
export class RefreshToken extends Model<RefreshToken, CreateToken> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@ForeignKey(() => User)
	userId: number;
	
	@BelongsTo(() => User)
	user: User
	
	@Column({type: DataType.DATE})
	dateEndRT1
	
	@Column({type: DataType.STRING})
	RT1: string;
}
