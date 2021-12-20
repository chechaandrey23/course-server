import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {ReviewIdDTO} from './reviewid.dto';

export class CommentAddWithoutDTO extends ReviewIdDTO {
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(3000)
	comment: string;

	@Transform(({value}) => {return !!value})
	@IsBoolean()
	draft: boolean = false;
}
