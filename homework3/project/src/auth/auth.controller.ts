import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create_user.dto";
import {RegistrationDto} from "./dto/registration.dto";
import {AuthService} from "./auth.service";
import {FileInterceptor} from "@nestjs/platform-express";

/*
    Контроллер, обрабатывающий запросы по эндпоинту 'auth'.
 */
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /*
        Эндпоинт для входа пользователя.
        Обрабытвает Post запрос по адресу http://localhost:Port/auth/login.
        Возвращает результат работы метода login из AuthService.
     */
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    /*
        Эндпоинт для регистрации нового пользователя.
        Обрабытвает Post запрос по адресу http://localhost:Port/auth/registration.
        Возвращает результат работы метода registration из AuthService.
     */
    @Post('/registration')
    @UseInterceptors(FileInterceptor('image'))
    registration(@Body() registrationDto: RegistrationDto, @UploadedFile() image) {
        return this.authService.registration(registrationDto, image);
    }

}
