import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class RoleAddDTO {
	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(0)
	@Max(Math.pow(2, 32) - 1)
	role: number;

	@Transform(({value}) => {return !value?'':value})
	@IsString()
	@MinLength(0)
	@MaxLength(255)
	title: string;

	@Transform(({value}) => {return !value?'':value})
	@IsString()
	@MinLength(0)
	@MaxLength(255)
	description: string;
}
