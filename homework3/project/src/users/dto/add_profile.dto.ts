import {IsNumber} from "class-validator";

/*
    Класс, в котором описаны и валидируются поля, необходимые для связывания профиля и пользователя.
    profileId: Уникальный идентификатор профиля пользователя,
    userId: Уникальный идентификатор пользователя, которому необходимо профиль.
 */
export class AddProfileDto {
    @IsNumber({}, {message: "Должно быть числом"})
    readonly profileId: number;

    @IsNumber({}, {message: "Должно быть числом"})
    readonly userId: number;
}