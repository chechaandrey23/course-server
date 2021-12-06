import {BelongsToMany, BelongsTo, Column, DataType, HasMany, Model, Table, ForeignKey} from "sequelize-typescript";

import {Review} from "./review.model";
import {Tag} from "../tags/tag.model";

interface CreateReviewTag {
	reviewId: number;
	tagId: number;
	selected: boolean;
}

@Table({tableName: 'review_tags', createdAt: false, updatedAt: false})
export class ReviewTags extends Model<ReviewTags, CreateReviewTag> {

	@ForeignKey(() => Review)
	@Column({type: DataType.INTEGER})
	reviewId: number;

	@BelongsTo(() => Review)
	review: Review;

	@ForeignKey(() => Tag)
	@Column({type: DataType.INTEGER})
	tagId: number;

	@BelongsTo(() => Tag)
	tag: Tag;

	@Column({type: DataType.BOOLEAN, defaultValue: false})
	selected: boolean;
}
