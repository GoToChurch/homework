import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {RegistrationDto} from "./dto/registration.dto";
import {CreateUserDto} from "../users/dto/create_user.dto";
import {UsersService} from "../users/users.service";
import {ProfilesService} from "../profiles/profiles.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {CreateProfileDto} from "../profiles/dto/create_profile.dto";
import {User} from "../users/users.model";

/*
    Класс по работе с авторизацией
 */
@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private profileService: ProfilesService,
                private jwtService: JwtService) {
    }

    /*
        Метод, отвещающий за регистрациию нового пользователя.
        Метод обращается к UsersService и ProfilesService для создания нового пользователя и его профиля соответственно.
        На вход принимает объект для регистрации нового пользователя типа RegistrationDto 'registrationDto' и
        изображение 'image'.
        Возваращает результат работы метода generateToken.
     */
    async registration(registrationDto: RegistrationDto, image:any) {
        await this.checkIfUserMayRegister(registrationDto);

        const hashPassword = await bcrypt.hash(registrationDto.password, 6);

        const profileDto: CreateProfileDto = {...registrationDto};
        const profile = await this.profileService.createProfile(profileDto, image);

        const userDto : CreateUserDto = {...registrationDto, profileId: profile.id};
        const user = await this.userService.createUser({...userDto, password: hashPassword});

        return this.generateToken(user);
    }

    /*
        Метод, отвещающий за вход пользователя.
        На вход принимает объект для создания нового пользователя типа CreateUserDto 'userDto'.
        Возваращает результат работы метода generateToken.
     */
    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    /*
        Метод, проверяющий, может ли быть зарегистрирован новый пользователь.
        На вход принимает объект для регистрации нового пользователя типа RegistrationDto 'registrationDto'.
        Возваращает пустой объект пользователя, если пользователя с указанным в 'registrationDto'
        почтовым адресом и логином не существует. В обратном случае бросает HttpException.
     */
    async checkIfUserMayRegister(registrationDto: RegistrationDto) {
        let userToRegister = await this.userService.getUserByEmail(registrationDto.email);

        if(userToRegister) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }

        userToRegister = await this.userService.getUserByLogin(registrationDto.login);
        if(userToRegister) {
            throw new HttpException('Пользователь с таким login уже существует', HttpStatus.BAD_REQUEST)
        }

        return userToRegister;
    }

    /*
        Метод, генерирующий jwt-токен.
        На вход принимает объект пользователя типа User 'user'.
        Возваращает объект, содержащий токен.
     */
    private async generateToken(user: User) {
        const payload = {
            id: user.id,
            login: user.login,
            email: user.email,
            roles: user.roles
        }

        return {
            token: this.jwtService.sign(payload)
        }
    }

    /*
        Метод, проверяющий, существует ли указаный пользователь в базе данных.
        На вход принимает объект для создания нового пользователя типа CreateUserDto 'userDto'.
        Возваращает объект пользователя типа User, если пользователь с указанными в CreateUserDto
        почтовым адресом и логином есть в базе данных, а также введен правильный пароль.
        В обратном случае бросает UnauthorizedException.
     */
    private async validateUser(userDto: CreateUserDto) {
        let user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);

        if(user && passwordEquals) {
            user = await this.userService.getUserByLogin(userDto.login);
            if (user) {
                return user;
            }

            throw new UnauthorizedException({message: 'Пользователя с таким логином не существует'})

        }

        throw new UnauthorizedException({message: 'Неправильный email или пароль'})
    }
}
