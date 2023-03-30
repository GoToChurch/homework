import {Controller, Delete, UseGuards} from '@nestjs/common';
import {FilesService} from "./files.service";
import {Roles} from "../auth/guards/roles_auth.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt_auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";

/*
    Контороллер, отрабытывающий запросы по эндпоинту 'files'.
 */
@Controller('files')
export class FilesController {
    constructor(private fileService: FilesService) {}

    /*
        Эндпоинт для удаления всех неликвидных файлов.
        Доступен только зарегистрированому пользователю, который является владельцем профиля и администратору.
        Обрабытвает Delete запрос по адресу http://localhost:Port/files/.
        Возвращает результат работы метода deleteAllDeadFiles из FilesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete()
    delete() {
        return this.fileService.deleteAllDeadFiles()
    }
}
