import {HasMany, Column, DataType, Model, Table} from "sequelize-typescript";

interface CreateLang {
	lang: string;
	title: string;
	description?: string;
}

@Table({tableName: 'langs', timestamps: true, paranoid: true, deletedAt: true})
export class Lang extends Model<Lang, CreateLang> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING, unique: true, allowNull: false})
	lang: string;
	
	@Column({type: DataType.STRING, allowNull: false})
	title: string;
	
	@Column({type: DataType.STRING})
	description: string;
}
