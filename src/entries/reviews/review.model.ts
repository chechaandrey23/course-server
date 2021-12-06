import {BelongsToMany, BelongsTo, ForeignKey, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {User} from '../users/user.model';
import {Tag} from '../tags/tag.model';
import {ReviewTags} from './review.tags.model';
import {TitleGroups} from '../titles/title.groups.model';
//import {Image} from '../images/image.model';
import {Rating} from '../ratings/rating.model';
import {Like} from '../likes/like.model';

interface CreateReview {
	description: string;
	text: string;
	authorRating: number;
	userId: number;
	titleGroupId: number;
	draft: boolean;
	blocked: boolean;
}

@Table({tableName: 'reviews', timestamps: true, paranoid: true, deletedAt: true})
export class Review extends Model<Review, CreateReview> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.BOOLEAN, defaultValue: false})
	blocked: boolean;

	@Column({type: DataType.TEXT})
	description: string;

	@Column({type: DataType.TEXT})
	text: string;

	@Column({type: DataType.BOOLEAN})
	draft: boolean;

	@Column({type: DataType.INTEGER})
	authorRating: number;

	@ForeignKey(() => User)
	@Column({type: DataType.INTEGER})
	userId: number;

	@BelongsTo(() => User)
	user: User

	@BelongsToMany(() => Tag, () => ReviewTags)
	tags: Tag[];

	@ForeignKey(() => TitleGroups)
	@Column({type: DataType.INTEGER})
	titleGroupId: number;

	@BelongsTo(() => TitleGroups)
	groupTitle: TitleGroups

	@HasMany(() => Rating)
	ratings: Rating

	@HasMany(() => Like)
	likes: Like

	@Column({type: DataType.STRING})
	searchId: string;
}
