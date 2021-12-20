import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class ThemeAddDTO {
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	theme: string;

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
