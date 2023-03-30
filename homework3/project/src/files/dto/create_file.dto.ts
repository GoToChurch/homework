import {IsString} from "class-validator";

/*
    Класс, в котором описаны и валидируются поля, необходимые для создания нового файла.
    name: Имя файла,
    essenceTable: Название таблицы, к которой относится файл,
    essenceId: Уникальный идентификатор записи, к которой относится файл.
 */
export class CreateFileDto {
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @IsString({message: 'Должно быть строкой'})
    readonly essenceTable: string;

    readonly essenceId: number;


}