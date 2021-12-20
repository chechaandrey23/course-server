import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {IdDTO} from './id.dto';

export class UserInfoEditWithoutDTO extends IdDTO {
	@Transform(({value}) => {return !value?'':value})
	@IsString()
	@MinLength(0)
	@MaxLength(255)
	first_name: string;

	@Transform(({value}) => {return !value?'':value})
	@IsString()
	@MinLength(0)
	@MaxLength(255)
	last_name: string;

	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	themeId: number;

	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	langId: number;
}
