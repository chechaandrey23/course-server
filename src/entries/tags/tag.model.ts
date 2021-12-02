import {BelongsToMany, ForeignKey, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {Review} from '../reviews/review.model';
import {ReviewTags} from '../reviews/review.tags.model';

interface CreateTag {
	tag: string;
}

@Table({tableName: 'tags', timestamps: true, paranoid: true, deletedAt: true})
export class Tag extends Model<Tag, CreateTag> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	tag: string;
	
	@BelongsToMany(() => Review, () => ReviewTags)
	reviews: Review[];
}
