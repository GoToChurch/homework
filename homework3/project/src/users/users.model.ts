import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user_roles.model";
import {Profile} from "../profiles/profiles.model";


/*
    Интерфейс с необходимыми полями для создания новой записи в таблице 'users'.
 */
interface UserCreationAttrs {
    email: string;
    password: string;
    login: string;
}

/*
    Описание тадлицы 'users' в базе данных.
    Связь между таблицами 'users' и 'roles': Many-to-Many,
    Связь между таблицами 'users' и 'profiles': One-to-One.
 */
@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    login: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ForeignKey(() => Profile)
    @Column({type: DataType.INTEGER})
    profileId: number;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @BelongsTo(() => Profile)
    profile: Profile;
}