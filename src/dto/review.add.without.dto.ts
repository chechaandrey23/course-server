import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class ReviewAddWithoutDTO {
	@Transform(({value}) => {return !value?'':value})
	@IsString()
	@MinLength(0)
	@MaxLength(255)
	description: string;

	@Transform(({value}) => {return !value?'':value})
	@IsString()
	@MinLength(0)
	@MaxLength(255)
	text: string;

	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(10)
	authorRating: number;

	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	titleId: number;

	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	groupId: number;

	@Transform(({value}) => {return !!value})
	@IsBoolean()
	draft: boolean;

	@IsArray()
	//@ValidateNested({each: true})
	@Transform(({value}) => {return value.map((val) => {return val*1})})
	@IsInt({each: true})
	@Min(1, {each: true})
	@Max(Math.pow(2, 32) - 1, {each: true})
	tags: number[];
}
