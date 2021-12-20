import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested, IsIn} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import  {PageDTO} from './page.dto';

export class CommentsDTO extends PageDTO {
	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	reviewId: number;
}
