import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req, UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {ProfilesService} from "./profiles.service";
import {CreateProfileDto} from "./dto/create_profile.dto";
import {Roles} from "../auth/guards/roles_auth.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt_auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {SelfProfileOrAdminGuard} from "../auth/guards/self_profile_or_admin.guard";

/*
    Контороллер, отрабытывающий запросы по эндпоинту 'profiles'.
 */
@Controller('profiles')
export class ProfilesController {
    constructor(private profileService: ProfilesService) {}

    /*
        Эндпоинт для создания нового профиля.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Post запрос по адресу http://localhost:Port/profiles.
        Не должен использоваться, создан только для тестирования. Создание нового пользователя происходит
        по адресу http://localhost:Port/auth/registration.
        На вход принимает тело запроса типа CreateProfileDto 'profileDto' и изображение 'image'.
        Возвращает результат работы метода createProfile из ProfilesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() profileDto: CreateProfileDto, @UploadedFile() image) {
        return this.profileService.createProfile(profileDto, image)
    }

    /*
        Эндпоинт для получения списка всех профилей.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/profiles.
        Возвращает результат работы метода getAllProfiles из ProfilesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    getAll() {
        return this.profileService.getAllProfiles();
    }

    /*
        Эндпоинт для получения профиля по id.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Get запрос по адресу http://localhost:Port/profiles/:id.
        На вход принимает параметр 'id' из url.
        Возвращает результат работы метода getProfileById из ProfilesService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:id')
    getOne(@Param('id') id: any) {
        return this.profileService.getProfileById(id);
    }

    /*
        Эндпоинт для редактированию профиля по его id.
        Доступен только зарегистрированому пользователю, который является владельцем профиля и администратору.
        Обрабытвает Put запрос по адресу http://localhost:Port/profiles/:id.
        На вход принимает тело запроса типа CreateUserDto 'userDto', параметр 'id' из url, объект http запроса 'request'
        для получения из него объекта активного пользователя и необизательный параметр файла 'image'.
        Возвращает результат работы метода editProfile из ProfilesService.
     */
    @UseGuards(JwtAuthGuard, SelfProfileOrAdminGuard)
    @Put('/:id')
    async edit(@Body() profileDto: CreateProfileDto,
               @Param('id') id: any,
               @Req() request: any,
               @UploadedFile() image?) {
        return this.profileService.editProfile(profileDto, id, image);
    }

    /*
        Эндпоинт для удаления профиля по его id.
        Доступен только зарегистрированому пользователю, который является владельцем профиля и администратору.
        Обрабытвает Delete запрос по адресу http://localhost:Port/profiles/:id.
        На вход принимает параметр 'id' из url, объект http запроса 'request'
        для получения из него объекта активного пользователя.
        Возвращает результат работы метода deleteProfile из ProfilesService.
     */
    @UseGuards(JwtAuthGuard, SelfProfileOrAdminGuard)
    @Delete('/:id')
    async delete(@Param('id') id: any, @Req() request: any) {
        return this.profileService.deleteProfile(id);
    }
}
