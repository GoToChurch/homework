import {Column, DataType, Model, Table} from "sequelize-typescript";

/*
    Интерфейс с необходимыми полями для создания новой записи в таблице 'files'.
 */
interface FileCreationAttrs {
    name: string;
    essenceTable: string;
    essenceId: number;
}

/*
    Описание тадлицы 'files' в базе данных.
    Связь между таблицами 'profiles' и 'files': One-to-One.
    Из задания мне не было понятно, какая связь должна быть между
    таблицами 'textblocks' и 'files'. Я установил связь One-to-One.
 */
@Table({tableName: 'files'})
export class FileModel extends Model<FileModel, FileCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: true})
    essenceTable: string;

    @Column({type: DataType.NUMBER, allowNull: true})
    essenceId: number;
}