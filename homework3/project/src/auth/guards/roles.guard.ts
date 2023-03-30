import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {ROLES_KEY} from "./roles_auth.decorator";


/*
    Guard, ограничивающий доступ к эндпоинту только пользователям с определенной ролью.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {}

    /*
        Метод, проверяющий наличие нужных ролей у пользователя.
        В своем теле обращается к объекту запроса и помещает в его тело объект пользователя, если в заголовках
        запроса был найден валидный Bearer token. Также получает список ролей из метаданных и проверяет наличие у
        актинвного пользователя хотя бы одной из нужных ролей. Если роль найдена возваращает true.
        В обратном случае вовзращает false.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])

            if (!requiredRoles) {
                return true;
            }

            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const [bearer, token] = authHeader.split(' ');

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token);
            req.user = user;

            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch (e) {
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}