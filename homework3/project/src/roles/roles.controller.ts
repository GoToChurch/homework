import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create_role.dto";
import {Roles} from "../auth/guards/roles_auth.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt_auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";


/*
    Контороллер, отрабытывающий запросы по эндпоинту 'roles'.
 */
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    /*
        Эндпоинт для создания нового пользователя.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Post запрос по адресу http://localhost:Port/roles.
        На вход принимает тело запроса типа CreateRoleDto 'dto'.
        Возвращает результат работы метода createRole из RolesService.
     */
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.createRole(dto);
    }

    /*
        Эндпоинт для получения всех ролей.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/roles.
        Возвращает результат работы метода getAllRoles из RolesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAll() {
        return this.rolesService.getAllRoles();
    }

    /*
        Эндпоинт для получения роли по названию.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/roles/:value.
        На вход принимает параметр 'value' из url.
        Возвращает результат работы метода getRoleByValue из RolesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:value')
    getByValue(@Param('value') value: string) {
        return this.rolesService.getRoleByValue(value);
    }

    /*
        Эндпоинт для редактирования роли по названию.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Put запрос по адресу http://localhost:Port/roles/:value.
        На вход принимает тело запроса типа CreateRoleDto 'dto' и параметр 'value' из url.
        Возвращает результат работы метода editRole из RolesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/:value')
    edit(@Body() dto: CreateRoleDto, @Param('value') value: string) {
        return this.rolesService.editRole(dto, value);
    }

    /*
        Эндпоинт для удаления роли по названию.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Delete запрос по адресу http://localhost:Port/roles/:value.
        На вход принимает параметр 'value' из url.
        Возвращает результат работы метода deleteRole из RolesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/:value')
    delete(@Param('value') value: string) {
        return this.rolesService.deleteRole(value);
    }
}
