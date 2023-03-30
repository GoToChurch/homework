import {IsString} from "class-validator";

/*
    Класс, в котором описаны и валидируются поля, необходимые для создания нового текстового блока.
    searchName: Имя текстового блока для поиска,
    name: Название текстового блока,
    text: Текст внутри текстового блока,
    group: Группа, к которой принадлжеит текстовый блок.
 */
export class CreateTextBlockDto {
    @IsString({message: 'Должно быть строкой'})
    readonly searchName: string;

    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @IsString({message: 'Должно быть строкой'})
    readonly text: string;

    @IsString({message: 'Должно быть строкой'})
    readonly group: string;

}