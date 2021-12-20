import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class TagsOrderDTO {
	@Transform(({value}) => {return !!value})
	@IsBoolean()
	order: boolean = false;
}
