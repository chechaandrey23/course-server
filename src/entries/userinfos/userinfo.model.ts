import {BelongsTo, Column, DataType, HasMany, HasOne, Model, Table, ForeignKey} from "sequelize-typescript";

import {User} from '../users/user.model';
import {Theme} from '../themes/theme.model';
import {Lang} from '../langs/lang.model';
//import {Like} from '../likes/like.model';

interface CreateUserInfo {
	userId: number;
	langId: number;
	themeId: number;
	first_name?: string;
	last_name?: string;
}

interface EditUserInfo {
	first_name: string;
	last_name: string;
	langId: number;
	themeId: number;
}

@Table({tableName: 'userinfos', timestamps: true, paranoid: true, deletedAt: true})
export class UserInfo extends Model<UserInfo, CreateUserInfo|EditUserInfo> {
	
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;
	
	@Column({type: DataType.STRING})
	first_name: string;
	
	@Column({type: DataType.STRING})
	last_name: string;
	
	@ForeignKey(() => Theme)
	@Column({type: DataType.INTEGER})
	themeId: number;
	
	@BelongsTo(() => Theme)
	theme: Theme
	
	@ForeignKey(() => Lang)
	@Column({type: DataType.INTEGER})
	langId: number;
	
	@BelongsTo(() => Lang)
	lang: Lang
	
	@ForeignKey(() => User)
	@Column({type: DataType.INTEGER})
	userId: number;
	
	@BelongsTo(() => User)
	user: User
}
