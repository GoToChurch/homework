import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {UserRoles} from "./user_roles.model";


/*
    Интерфейс с необходимыми полями для создания новой записи в таблице 'roles'.
 */
interface RoleCreationAttrs {
    value: string;
    description: string;
}

/*
    Описание тадлицы 'roles' в базе данных.
    Связь между таблицами 'users' и 'roles': Many-to-Many.
 */
@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];
}

