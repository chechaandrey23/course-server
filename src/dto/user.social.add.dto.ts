import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class UserSocialAddDTO {
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	social_id: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	vendor: string;

	@Transform(({value}) => {return !!value})
	@IsBoolean()
	soft_create: boolean = false;

	@IsString()
	@MinLength(0)
	@MaxLength(255)
	displayName: string = '';
}
