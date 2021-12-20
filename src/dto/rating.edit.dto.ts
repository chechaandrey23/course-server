import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {RatingAddDTO} from './rating.add.dto';

export class RatingEditDTO extends RatingAddDTO {
	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	id: number;
}
