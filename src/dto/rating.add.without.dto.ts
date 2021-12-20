import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {ReviewIdDTO} from './reviewid.dto';

export class RatingAddWithoutDTO extends ReviewIdDTO {
	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(5)
	rating: number;
}
