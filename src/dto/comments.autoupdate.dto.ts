import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested, IsIn} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import  {ReviewIdDTO} from './reviewid.dto';

export class CommentsAutoUpdateDTO extends ReviewIdDTO {
	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(0)
	//@Max(Math.pow(2, 32) - 1)
	time: number;
}
