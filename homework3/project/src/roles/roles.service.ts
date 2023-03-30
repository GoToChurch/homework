import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {CreateRoleDto} from "./dto/create_role.dto";


/*
    Класс по работе с таблицей 'roles'.
 */
@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    /*
        Метод для создания новой роли.
        На вход получает объект для создания новой роли типа CreateRoleDto 'dto'.
        Возвращает промис с созданной ролью.
    */
    async createRole(dto: CreateRoleDto) {
        return await this.roleRepository.create(dto);
    }

    /*
        Метод для получения всех ролей из таблицы.
        Возвращает промис со списком всех ролей.
    */
    async getAllRoles() {
        return await this.roleRepository.findAll();
    }

    /*
        Метод для получения пользователя по названию.
        На вход получает название роли 'value'.
        Возвращает промис с найденным по уникальному идентификатору пользователем в таблице.
    */
    async getRoleByValue(value: string) {
        return await this.roleRepository.findOne({
            where: {
                value: value
            }
        });
    }

    /*
        Метод для изменения данных в таблице роли по названию.
        На вход получает объект для создания новой роли типа CreateRoleDto 'dto'
        и название роли 'value'.
        Возвращает промис с найденной по навзванию ролью в таблице.
    */
    async editRole(dto: CreateRoleDto, value: string) {
        await this.roleRepository.update({...dto}, {
            where: {
                value: value
            }
        });

        return this.getRoleByValue(dto.value);
    }

    /*
        Метод для удаления роли из таблицы.
        На вход получает название роли 'value'.
        Возвращает промис с удаленной по навзванию ролью в таблице.
    */
    async deleteRole(value: string) {
        return await this.roleRepository.destroy({
            where: {
                value: value
            }
        });
    }
}
