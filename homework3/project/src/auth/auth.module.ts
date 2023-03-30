import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {ProfilesModule} from "../profiles/profiles.module";
import {JwtModule} from "@nestjs/jwt";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Profile} from "../profiles/profiles.model";
import {FilesModule} from "../files/files.module";

@Module({
      imports: [
          SequelizeModule.forFeature([User, Profile]),
          forwardRef(() => UsersModule),
          forwardRef(() => ProfilesModule),
          forwardRef(() => FilesModule),
          JwtModule.register({
              secret: process.env.PRIVATE_KEY || 'SECRETKEY_SSSSSAAAAS',
              signOptions: {
                  expiresIn: '24h'
              }
          })
      ],
      controllers: [AuthController],
      providers: [AuthService],
      exports: [
          AuthService,
          JwtModule
        ]
})
export class AuthModule {}
