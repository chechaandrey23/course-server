import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested, IsIn} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import  {PageDTO} from './page.dto';

export class ReviewsFilterDTO extends PageDTO {
	@ValidateIf(({tags}) => !!tags)
	@IsArray()
	//@ValidateNested({each: true})
	@Transform(({value}) => {return value.map((val) => {return val*1})})
	@IsInt({each: true})
	@Min(1, {each: true})
	@Max(Math.pow(2, 32) - 1, {each: true})
	tags: number[];

	@ValidateIf(({titles}) => !!titles)
	@IsArray()
	//@ValidateNested({each: true})
	@Transform(({value}) => {return value.map((val) => {return val*1})})
	@IsInt({each: true})
	@Min(1, {each: true})
	@Max(Math.pow(2, 32) - 1, {each: true})
	titles: number[];

	@ValidateIf(({groups}) => !!groups)
	@IsArray()
	//@ValidateNested({each: true})
	@Transform(({value}) => {return value.map((val) => {return val*1})})
	@IsInt({each: true})
	@Min(1, {each: true})
	@Max(Math.pow(2, 32) - 1, {each: true})
	groups: number[];

	@ValidateIf(({sortField}) => !!sortField)
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	sortField: string;

	@ValidateIf(({sortType}) => !!sortType)
	@IsString()
	@IsIn(["ASC", "DESC"])
	@MinLength(1)
	@MaxLength(255)
	sortType: "ASC"|"DESC";
}
