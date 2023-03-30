import {Module} from '@nestjs/common';
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UserRoles} from "./user_roles.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles]),
        AuthModule
    ],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [
        RolesService
    ]
})
export class RolesModule {}
