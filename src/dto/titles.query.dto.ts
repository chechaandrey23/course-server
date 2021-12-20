import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class TitlesQueryDTO {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(255)
	query: string;
}
