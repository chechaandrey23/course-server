import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {ReviewIdDTO} from './reviewid.dto';

export class LikeAddWithoutDTO extends ReviewIdDTO {
	@IsNotEmpty()
	@Transform(({value}) => {return !!value})
	@IsBoolean()
	like: boolean;
}
