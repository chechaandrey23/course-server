import {BelongsTo, ForeignKey, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {User} from '../users/user.model';
import {Review} from '../reviews/review.model';

interface CreateRating {
	userId: number;
	reviewId: number;
	userRating: number;
}

@Table({tableName: 'ratings', timestamps: true, paranoid: true, deletedAt: true})
export class Rating extends Model<Rating, CreateRating> {
	
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
	
	@Column({type: DataType.INTEGER, allowNull: false})
	userRating: number;
}
