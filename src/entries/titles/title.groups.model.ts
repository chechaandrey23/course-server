import {BelongsToMany, BelongsTo, Column, DataType, HasMany, Model, Table, ForeignKey} from "sequelize-typescript";

import {Title} from "./title.model";
import {Group} from "../groups/group.model";

export interface CreateTitleGroup {
	titleId: number;
	groupId: number;
}

@Table({tableName: 'title_groups', createdAt: false, updatedAt: false/*, timestamps: true, paranoid: true, deletedAt: true */})
export class TitleGroups extends Model<TitleGroups, CreateTitleGroup> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@ForeignKey(() => Group)
	@Column({type: DataType.INTEGER})
	groupId: number;
	
	@ForeignKey(() => Title)
	@Column({type: DataType.INTEGER})
	titleId: number;
	
	@BelongsTo(() => Title)
	title: Title
	
	@BelongsTo(() => Group)
	group: Group
}
