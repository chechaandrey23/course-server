import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class UserAddDTO {
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	user: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	password: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	email: string;

	@IsString()
	@MinLength(0)
	@MaxLength(255)
	first_name: string = '';

	@IsString()
	@MinLength(0)
	@MaxLength(255)
	last_name: string = '';
}
