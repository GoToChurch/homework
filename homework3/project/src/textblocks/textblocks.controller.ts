import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {TextBlocksService} from "./textblocks.service";
import {Roles} from "../auth/guards/roles_auth.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt_auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {CreateTextBlockDto} from "./dto/create_textblock.dto";
import {FileInterceptor} from "@nestjs/platform-express";


/*
    Контороллер, отрабытывающий запросы по эндпоинту 'textblocks'.
 */
@Controller('textblocks')
export class TextblocksController {
    constructor(private textBlockService: TextBlocksService) {}

    /*
        Эндпоинт для создания нового текстового блока.
        Доступен только зарегистрированому пользователю.
        Обрабытвает Post запрос по адресу http://localhost:Port/textblocks.
        На вход принимает тело запроса типа CreateTextBlockDto 'textBlockDto' и изображение 'image'.
        Возвращает результат работы метода createTextBlock из TextBlocksService.
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() textBlockDto: CreateTextBlockDto, @UploadedFile() image) {
        return this.textBlockService.createTextBlock(textBlockDto, image);
    }

    /*
        Эндпоинт для получения списка всех текстовых блоков.
        Доступен только зарегистрированому пользователю.
        Обрабытвает Get запрос по адресу http://localhost:Port/textblocks.
        Возвращает результат работы метода getAll из TextBlocksService.
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.textBlockService.getAll();
    }

    /*
        Эндпоинт для получения списка текстовых блоков по группе.
        Доступен только зарегистрированому пользователю.
        Обрабытвает Get запрос по адресу http://localhost:Port/textblocks/:group.
        На вход принимает параметр 'group' из url.
        Возвращает результат работы метода getTextBlockByGroup из TextBlocksService.
     */
    @UseGuards(JwtAuthGuard)
    @Get('/:group')
    filtberByGroup(@Param('group') group: any) {
        return this.textBlockService.getTextBlockByGroup(group);
    }

    /*
        Эндпоинт для редактированию текстового блока по его id.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Put запрос по адресу http://localhost:Port/textblocks/:id.
        На вход принимает тело запроса типа CreateTextBlockDto 'textBlockDto',
        параметр 'id' из url и необизательный параметр файла 'image'.
        Возвращает результат работы метода editUser из TextBlocksService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/:id')
    edit(@Body() textBlockDto: CreateTextBlockDto, @Param('id') id: any, @UploadedFile() image?) {
        return this.textBlockService.editTextBlock(textBlockDto, id, image);
    }

    /*
        Эндпоинт для удаления текстового по его id.
        Доступен только зарегистрированому пользователю, являющемуся администратором.
        Обрабытвает Delete запрос по адресу http://localhost:Port/users/:id.
        На вход принимает параметр 'id' из url.
        Возвращает результат работы метода deleteTextBlock из TextBlocksService.
     */
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/:id')
    delete(@Param('id') id: any) {
        return this.textBlockService.deleteTextBlock(id);
    }
}
