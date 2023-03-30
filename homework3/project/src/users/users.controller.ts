import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';
import {CreateUserDto} from "./dto/create_user.dto";
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/guards/jwt_auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/guards/roles_auth.decorator";
import {AddRoleDto} from "./dto/add_role.dto";
import {SelfUserOrAdminGuard} from "../auth/guards/self_user_or_admin.guard";

/*
    Контороллер, отрабытывающий запросы по эндпоинту 'users'.
 */
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    /*
        Эндпоинт для создания нового пользователя.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Post запрос по адресу http://localhost:Port/users.
        Не должен использоваться, создан только для тестирования. Создание нового пользователя происходит
        по адресу http://localhost:Port/auth/registration.
        На вход принимает тело запроса типа CreateUserDto 'userDto'.
        Возвращает результат работы метода createUser из UsersService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    /*
        Эндпоинт для получения списка всех пользователей.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/users.
        Возвращает результат работы метода getAllUsers из UsersService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAll() {
        return this.userService.getAllUsers();
    }

    /*
        Эндпоинт для получения пользователя по id.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/users/:id.
        На вход принимает параметр 'id' из url.
        Возвращает результат работы метода getUserById из UsersService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:id')
    getOne(@Param('id') id: any) {
        return this.userService.getUserById(id)
    }

    /*
        Эндпоинт для редактированию пользователя по его id.
        Доступен только зарегистрированому пользователю, который является владельцем аккаунта и администратору.
        Обрабытвает Put запрос по адресу http://localhost:Port/users/:id.
        На вход принимает тело запроса типа CreateUserDto 'userDto', параметр 'id' из url и объект http запроса 'request',
        для получения из него объекта активного пользователя.
        Возвращает результат работы метода editUser из UsersService.
     */
    @UseGuards(JwtAuthGuard, SelfUserOrAdminGuard)
    @Put('/:id')
    async update(@Body() userDto: CreateUserDto, @Param('id') id: any, @Req() request: any) {
        return this.userService.editUser(userDto, id);
    }

    /*
        Эндпоинт для удаления полльзователя по его id.
        Доступен только зарегистрированому пользователю, который является владельцем аккаунта и администратору.
        Обрабытвает Delete запрос по адресу http://localhost:Port/users/:id.
        На вход принимает параметр 'id' из url и объект http запроса 'request',
        для получения из него объекта активного пользователя.
        Возвращает результат работы метода deleteUser из UsersService.
     */
    @UseGuards(JwtAuthGuard, SelfUserOrAdminGuard)
    @Delete('/:id')
    async delete(@Param('id') id: any, @Req() request: any) {
        return this.userService.deleteUser(id);

    }

    /*
        Эндпоинт для добавления новой роли role пользователю.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Post запрос по адресу http://localhost:Port/users/:role.
        На вход принимает тело запроса типа AddRoleDto 'dto'.
        Возвращает результат работы метода addRole из UsersService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/:role')
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto);
    }
}
