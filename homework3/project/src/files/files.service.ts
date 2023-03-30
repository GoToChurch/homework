import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {FileModel} from "./files.model";
import {CreateFileDto} from "./dto/create_file.dto";

import * as path from 'path'
import * as fs from 'fs';
import * as uuid from 'uuid';

/*
    Класс по работе с таблицей 'files'
 */
@Injectable()
export class FilesService {
    constructor(@InjectModel(FileModel) private fileRepository: typeof FileModel) {}

    /*
        Метод для создания нового файла и записи его на диск.
        На вход получает объект файла 'file'.
        Возвращает промис с именем файла.
    */
    async createFileInDisc(file): Promise<string> {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', 'static')

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }

            fs.writeFileSync(path.join(filePath, fileName), file.buffer)

            return fileName;
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /*
        Метод для создания нового файла и записи его в базу данных.
        На вход получает имя файла 'filename', название связанной таблицы 'table'
        и уникальный идентификатор связанного объекта 'id'.
        Возвращает промис с созданным файлом.
    */
    async createFileInDatabase(filename: string, table: string, id: number) {

        const fileDto: CreateFileDto = {
            name: filename,
            essenceTable: table,
            essenceId: id
        }

        return this.fileRepository.create(fileDto);
    }

    /*
        Метод для получения всех файлов из таблицы.
        Возвращает промис со списком всех файлов.
    */
    async getAllFiles() {
        return await this.fileRepository.findAll();
    }

    /*
        Метод для получения файла по уникальному идентификатору.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с найденным по уникальному идентификатору файлом в таблице.
    */
    async getFileById(id: number) {
        return await this.fileRepository.findByPk(id);
    }

    /*
        Метод для получения файла по имени.
        На вход получает имя файла 'name'.
        Возвращает промис с найденным по имени файлом в таблице.
    */
    async getFileByName(name: string) {
        return await this.fileRepository.findOne({
            where: {
                name: name
            }
        });
    }

    /*
        Метод для удаления файла из таблицы и с диска.
        На вход получает уникальный идентификатор 'id'.
        Возвращает промис с удаленным по уникальному идентификатору файлом в таблице.
    */
    async deleteFile(id: number) {
        const file = await this.getFileById(id);
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', file.name));

        return await this.fileRepository.destroy({
            where: {
                id: id
            }
        })
    }

    /*
        Метод для удаления файла всех неликвидных файлов с базы данных и с диска.
        Файл считается неликвидным, если с момента его создания прошло больше часа или если на него больше нет ссылок.
        Возвращает массив удалленых файлов.
    */
    async deleteAllDeadFiles() {
        const allFiles = await this.getAllFiles();
        const deletedFiles = [];

        for (let file of allFiles) {
            if (!file.essenceId || !file.essenceTable || file.createdAt < Date.now() - (60 * 60 * 1000)) {
                deletedFiles.push(file);
                this.deleteFile(file.id);
            }
        }
        return deletedFiles;
    }

    /*
        Метод для создания файла, связанного с сущностью (профилем или текстовым блоком).
        На вход получает файл 'image', название сущности 'entityName' и объект сущности 'entity'.
        Возвращает промис с созданным файлом.
    */
    async createFile(image, entityName, entity) {
        const fileName = await this.createFileInDisc(image);
        return await this.createFileInDatabase(fileName, entityName, entity.id);
    }

    /*
        Метод для добавления файла в поле fileId связанной сущности (профиля или текстового блока).
        На вход получает объект сущности 'entity' и файл 'image'.
    */
    async addFileInEntity(entity, file) {
        if (entity.fileId) {
            entity.fileId = null;
        }

        entity.fileId = file.id;
        entity.save();
    }
}
