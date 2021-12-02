import {BelongsTo, ForeignKey, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {User} from '../users/user.model';
//import {Review} from '../reviews/review.model';

interface CreateImage {
	url: string;
	vendor: string;
	userId: number;
	//reviewId: number;
}

@Table({tableName: 'images', timestamps: true, paranoid: true, deletedAt: true})
export class Image extends Model<Image, CreateImage> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	url: string;
	
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	filename: string;
	
	@Column({type: DataType.STRING})
	vendor: string;
	
	@ForeignKey(() => User)
	userId: number;
	
	@BelongsTo(() => User)
	user: User
	
	//@ForeignKey(() => Review)
	//reviewId: number;
	
	//@BelongsTo(() => Review)
	//review: Review
}
