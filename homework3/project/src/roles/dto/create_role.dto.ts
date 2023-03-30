import {IsString} from "class-validator";

/*
    Класс, в котором описаны и валидируются поля, необходимые для создания новой роли.
    value: Название роли,
    description: Описание роли.
 */
export class CreateRoleDto {
    @IsString({message: 'Должно быть строкой'})
    readonly value: string;

    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}