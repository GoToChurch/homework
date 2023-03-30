import {forwardRef, Module} from '@nestjs/common';
import {ProfilesController} from './profiles.controller';
import {ProfilesService} from './profiles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import {Profile} from "./profiles.model";
import {FileModel} from "../files/files.model";
import {FilesModule} from "../files/files.module";


@Module({
  imports: [
      SequelizeModule.forFeature([User, Profile, FileModel]),
      forwardRef(() => UsersModule),
      forwardRef(() => AuthModule),
      FilesModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [
      ProfilesService
  ]
})
export class ProfilesModule {}
