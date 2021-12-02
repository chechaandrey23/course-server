import {BelongsTo, ForeignKey, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {User} from '../users/user.model';
import {Review} from '../reviews/review.model';

interface CreateLike {
	userId: number;
	reviewId: number;
	like: boolean;
}

@Table({tableName: 'likes', timestamps: true, paranoid: true, deletedAt: true})
export class Like extends Model<Like, CreateLike> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@ForeignKey(() => User)
	userId: number;
	
	@BelongsTo(() => User)
	user: User
	
	@ForeignKey(() => Review)
	reviewId: number;
	
	@BelongsTo(() => Review)
	review: Review
	
	@Column({type: DataType.BOOLEAN, allowNull: false})
	like: boolean;
}
