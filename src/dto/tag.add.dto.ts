import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class TagAddDTO {
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	tag: string;
}
