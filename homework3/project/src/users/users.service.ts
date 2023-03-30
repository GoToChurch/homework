import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create_user.dto";
import {AddRoleDto} from "./dto/add_role.dto";
import {RolesService} from "../roles/roles.service";
import {ProfilesService} from "../profiles/profiles.service";

import * as bcrypt from 'bcryptjs'

/*
    Класс по работе с таблицей 'users'
 */
@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService,
                private profileService: ProfilesService) {}

    /*
        Метод для создания нового пользователя.
        На вход получает объект для создания нового пользователя типа CreateUserDto 'dto'.
        Возвращает промис с созданным пользователем.
    */
    async createUser(dto: CreateUserDto) {

        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue('USER');
        const profile = await this.profileService.getProfileById(dto.profileId);

        await this.setProfileAndRoleForUser(user, role, profile)

        return user;
    }

    /*
        Метод для получения всех пользователей из таблицы.
        Возвращает промис со списком всех пользователей.
    */
    async getAllUsers() {
        return await this.userRepository.findAll({
            include: {
                all: true
            }
        });
    }

    /*
        Метод для получения пользователя по уникальному идентификатору.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с найденным по уникальному идентификатору пользователем в таблице.
    */
    async getUserById(id: number) {
        return await this.userRepository.findByPk(id, {
            include: {
                all: true
            }
        });
    }

    /*
        Метод для получения пользователя по почтовому адресу.
        На вход получает почтовый адрес 'email'.
        Возвращает промис с найденным по почтовому адресу пользователем в таблице.
    */
    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email: email
            },
            include: {
                all: true
            }
        });
    }

    /*
        Метод для получения пользователя по логину.
        На вход получает логин пользователя 'login'.
        Возвращает промис с найденным по логину пользователем в таблице.
    */
    async getUserByLogin(login: string) {
        return await this.userRepository.findOne({
            where: {
                login: login
            },
            include: {
                all: true
            }
        });
    }

    /*
        Метод для изменения данных в таблице пользователя по уникальному идентификатору.
        На вход получает объект для создания нового пользователя типа CreateUserDto 'dto'
        и уникальный идентификатор 'id'.
        Возвращает промис с найденным по уникальному идентификатору пользователем в таблице.
    */
    async editUser(dto: CreateUserDto, id: number) {
        const hashPassword = await bcrypt.hash(dto.password, 6);
        await this.userRepository.update({...dto, password: hashPassword}, {
            where: {
                id: id
            }
        });

        return this.getUserById(id);
    }

    /*
        Метод для удаления пользователя из таблицы.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с удаленным по уникальному идентификатору пользователем в таблице.
    */
    async deleteUser(id: number) {
        return await this.userRepository.destroy({
            where: {
                id: id
            }
        });
    }

    /*
        Метод для добавления пользователю новой роли.
        На вход получает объяект для добавления роли пользователю типа AddRoleDto 'dto'.
        Возвращает промис с объектом для добавления новой роли.
        Если по указанным полям в объекте dto нет записей в таблице User или Role, выбрасывает HttpException.
    */
    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);

        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    /*
        Приватный метод для присваивания значений полям 'roles' и 'profile' пользователю,
        а также для присваивания значения полю 'owner' связанному с полученным пользователем профилю.
        Добавления в профиль происходит здесь из-за того, что у меня, по какой-то причине, не инжектится данный класс
        в класс ProfileService, в котором происходит вся работа с сущностью профиля.
        На вход получает объяекты пользователя 'user', роли 'role' и профиля 'profie'.

    */
    private async setProfileAndRoleForUser(user, role, profile): Promise<void> {
        await user.$set('roles', [role.id]);

        if (user && profile) {
            await profile.$set('owner', user.id);
            await user.$set('profile', [profile.id]);
        }

        user.roles = [role];
    }
}
