import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {RolesModule} from "../roles/roles.module";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user_roles.model";
import {ProfilesModule} from "../profiles/profiles.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      SequelizeModule.forFeature([User, Role, UserRoles]),
      RolesModule,
      forwardRef(() => ProfilesModule),
      forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
      UsersService
  ]
})
export class UsersModule {}
