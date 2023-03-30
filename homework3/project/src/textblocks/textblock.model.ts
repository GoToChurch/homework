import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {FileModel} from "../files/files.model";


/*
    Интерфейс с необходимыми полями для создания новой записи в таблице 'textblocks'
 */
interface TextBlockCreationAttrs {
    searchName: string;
    name: string;
    text: string;
    group: string;
}

/*
    Описание тадлицы 'textblocks' в базе данных. Из задания мне не было понятно, какая связь должна быть между
    таблицами 'textblocks' и 'files'. Я установил связь One-to-One.
 */
@Table({tableName: 'textblocks'})
export class TextBlock extends Model<TextBlock, TextBlockCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    searchName: string;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    text: string;

    @Column({type: DataType.STRING, allowNull: false})
    group: string;

    @ForeignKey(() => FileModel)
    @Column({type: DataType.INTEGER})
    fileId: number;

    @BelongsTo(() => FileModel)
    file: FileModel;
}