import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { UserRoleGuard } from "../guards/user-role.guard";
import { ValidRoles } from "../interfaces";
import { RoleProtected } from "./role-protected.decorator";

/**
 *
 * @param roles - Desde el controlador se envian los roles como tipo ValidRoles
 * @returns la aplicacion conjunta del decorator y los 2 guards
 */
export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(
            AuthGuard(),
            UserRoleGuard
        )
    );
}
