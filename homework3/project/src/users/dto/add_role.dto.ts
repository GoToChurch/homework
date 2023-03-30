import {IsNumber, IsString} from "class-validator";

/*
    Класс, в котором описаны и валидируются поля, необходимые для добавления новой роли пользователю.
    value: Название новой роли,
    userId: Уникальный идентификатор пользователя, которому необходимо добавить роль.
 */
export class AddRoleDto {
    @IsString({message: "Должно быть строкой"})
    readonly value: string;

    @IsNumber({}, {message: "Должно быть числом"})
    readonly userId: number;
}