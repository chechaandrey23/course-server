import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {Title} from '../titles/title.model';
import {TitleGroups} from '../titles/title.groups.model';

interface CreateGroup {
	group: string;
	description?: string;
}

@Table({tableName: 'groups', timestamps: true, paranoid: true, deletedAt: true})
export class Group extends Model<Group, CreateGroup> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	group: string;
	
	@Column({type: DataType.STRING})
	description: string;
	
	@BelongsToMany(() => Title, () => TitleGroups)
	titles: Title[];
}
