import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

interface CreateTheme {
	theme: string;
	title: string;
	description?: string;
}

@Table({tableName: 'themes', timestamps: true, paranoid: true, deletedAt: true})
export class Theme extends Model<Theme, CreateTheme> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	theme: string;
	
	@Column({type: DataType.STRING, allowNull: false})
	title: string;
	
	@Column({type: DataType.STRING})
	description: string;
}
