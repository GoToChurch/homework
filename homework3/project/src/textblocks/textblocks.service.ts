import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TextBlock} from "./textblock.model";
import {CreateTextBlockDto} from "./dto/create_textblock.dto";
import {FilesService} from "../files/files.service";

/*
    Класс по работе с таблицей 'textblocks'
 */
@Injectable()
export class TextBlocksService {

    constructor(@InjectModel(TextBlock) private textBlockRepository: typeof TextBlock,
                private fileService: FilesService) {}

    /*
        Метод для создания нового текстового блока.
        На вход получает объект для создания нового текстового блока типа CreateTextBlockDto 'dto'
        и изображение 'image',
        которое сохраняет в таблице 'files' в базе данных, а также в директории 'static' на диске.
        Возвращает промис с созданным текстовым блоком.
    */
    async createTextBlock(dto: CreateTextBlockDto, image: any) {
        const textBlock = await this.textBlockRepository.create(dto);

        const file = await this.fileService.createFile(image, "textBlock", textBlock);

        await this.fileService.addFileInEntity(textBlock, file);

        return textBlock;
    }

    /*
        Метод для получения всех текстовых блоков из таблицы.
        Возвращает промис со списком всех текстовых блоков.
    */
    async getAll() {
        return await this.textBlockRepository.findAll();
    }

    /*
        Метод для получения текстового блока по уникальному идентификатору.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с найденным по уникальному идентификатору текстовым блоком в таблице.
    */
    async getTextBlockById(id: number) {
        return await this.textBlockRepository.findByPk(id, {
            include: {
                all: true
            }
        });
    }

    /*
        Метод для получения текстового блока по группе.
        На вход получает значение группы 'group'.
        Возвращает промис с найденным по значению группы текстовым блоком в таблице.
    */
    async getTextBlockByGroup(group: string) {
        return await this.textBlockRepository.findAll({
            where: {
                group: group
            },
            include: {
                all: true
            }
        });
    }

    /*
        Метод для изменения данных в таблице текстового блока по уникальному идентификатору.
        На вход получает объект для создания нового пользователя типа CreateTextBlockDto 'dto',
        уникальный идентификатор 'id' и необязательный параметр 'image'.
        Если указан параметр 'image', то записывает новый файл на диск и в базу данных
        и изменяет его в объекте текстового блока, а сторый файл удаляет.
        Возвращает промис с найденным по уникальному идентификатору текстовым блоком в таблице.
    */
    async editTextBlock(dto: CreateTextBlockDto, id: number, image?: any) {
        await this.textBlockRepository.update({...dto}, {
            where: {
                id: id
            },
        });

        const textBlock = await this.getTextBlockById(id);

        if (image) {
            await this.fileService.deleteFile(textBlock.fileId);
            const file = await this.fileService.createFile(image, "textBlock", textBlock);
            await this.fileService.addFileInEntity(textBlock, file);
        }

        return textBlock;
    }

    /*
        Метод для удаления текстового блока из таблицы.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с удаленным по уникальному идентификатору текстовым блоком в таблице.
    */
    async deleteTextBlock(id: number) {
        const textBlock = await this.getTextBlockById(id);
        await this.fileService.deleteFile(textBlock.fileId)

        return this.textBlockRepository.destroy({
            where: {
                id: id
            }
        });
    }
}
