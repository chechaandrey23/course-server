import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

import {CommentAddWithoutDTO} from './comment.add.without.dto';

export class CommentAddDTO extends CommentAddWithoutDTO {
	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	userId: number;

	@Transform(({value}) => {return !!value})
	@IsBoolean()
	blocked: boolean;
}
