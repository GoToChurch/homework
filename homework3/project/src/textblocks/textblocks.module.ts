import {Module} from '@nestjs/common';
import {TextblocksController} from './textblocks.controller';
import {TextBlocksService} from './textblocks.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TextBlock} from "./textblock.model";
import {FileModel} from "../files/files.model";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";

@Module({
  imports: [
      SequelizeModule.forFeature([TextBlock, FileModel]),
      AuthModule,
      FilesModule
  ],
  controllers: [TextblocksController],
  providers: [TextBlocksService]
})
export class TextblocksModule {}
