import {BelongsTo, ForeignKey, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {User} from '../users/user.model';
import {Review} from '../reviews/review.model';

interface CreateComment {
	userId: number;
	reviewId: number;
	comment: string;
	draft: boolean;
	blocked: boolean;
}

@Table({tableName: 'comments', timestamps: true, paranoid: true, deletedAt: true})
export class Comment extends Model<Comment, CreateComment> {
	
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
	
	@Column({type: DataType.TEXT, allowNull: false})
	comment: string;
	
	@Column({type: DataType.BOOLEAN})
	draft: boolean;
	
	@Column({type: DataType.BOOLEAN, defaultValue: false})
	blocked: boolean;
}
