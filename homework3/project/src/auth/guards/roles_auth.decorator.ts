import {SetMetadata} from "@nestjs/common";

export const ROLES_KEY = 'roles';

/*
    Декоратор, добавляющий в метаданных указанные в параметрах роли.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);