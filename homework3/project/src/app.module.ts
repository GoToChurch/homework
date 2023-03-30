import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {UsersModule} from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {RolesModule} from './roles/roles.module';
import {ProfilesModule} from './profiles/profiles.module';
import {User} from "./users/users.model";
import {Role} from "./roles/roles.model";
import {UserRoles} from "./roles/user_roles.model";
import {Profile} from "./profiles/profiles.model";
import {TextblocksModule} from './textblocks/textblocks.module';
import {FilesModule} from './files/files.module';
import {AuthModule} from './auth/auth.module';
import {TextBlock} from "./textblocks/textblock.model";
import {FileModel} from "./files/files.model";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path'

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: '.env'
      }),
      SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          models: [User, Role, UserRoles, Profile, TextBlock, FileModel],
          autoLoadModels: true,
          synchronize: false
      }),
      ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, 'static'),
      }),
    UsersModule,
    RolesModule,
    ProfilesModule,
    TextblocksModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
