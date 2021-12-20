import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {IdDTO} from './id.dto';

export class UserEditDTO extends IdDTO {
	//@IsNotEmpty()
	@Transform(({value}) => {return !value?'':value})
	@ValidateIf(({user}) => user !== '')
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	user: string;

	//@IsNotEmpty()
	@Transform(({value}) => {return !value?'':value})
	@ValidateIf(({social_id}) => social_id !== '')
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	social_id: string;

	//@IsNotEmpty()
	@Transform(({value}) => {return !value?'':value})
	@ValidateIf(({email}) => email !== '')
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	@IsEmail()
	email: string;

	@Transform(({value}) => {return !!value})
	@IsBoolean()
	blocked: boolean;

	@Transform(({value}) => {return !!value})
	@IsBoolean()
	activated: boolean;

	@IsArray()
	//@ValidateNested({each: true})
	@Transform(({value}) => {return value.map((val) => {return val*1})})
	@IsInt({each: true})
	@Min(1, {each: true})
	@Max(Math.pow(2, 32) - 1, {each: true})
	roles: number[];
}
