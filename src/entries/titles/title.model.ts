import {BelongsToMany, ForeignKey, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

import {Group} from '../groups/group.model';
import {TitleGroups} from './title.groups.model';

interface CreateTitle {
	title: string;
	description?: string;
}

@Table({tableName: 'titles', timestamps: true, paranoid: true, deletedAt: true})
export class Title extends Model<Title, CreateTitle> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	title: string;
	
	@Column({type: DataType.TEXT})
	description: string;
	
	@BelongsToMany(() => Group, () => TitleGroups)
	groups: Group[];
}
