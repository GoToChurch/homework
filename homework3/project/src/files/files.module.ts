import {forwardRef, Module} from '@nestjs/common';
import {FilesController} from './files.controller';
import {FilesService} from './files.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {FileModel} from "./files.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      SequelizeModule.forFeature([FileModel]),
      forwardRef(() => AuthModule),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [
      FilesService
  ]
})
export class FilesModule {}
