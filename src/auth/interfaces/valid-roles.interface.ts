export enum ValidRoles {
    admin = 'admin',
    superUser = 'super-user',
    user = 'user'   
}

/**
 * @ValidRoles - interface(enum) que trabajara los roles para ser instanciados desde el
 * role-protected y posteriormente al user-role-guard OJO: si no le pones el valor(comillas)
 * la validacion tomara los roles como [0,1,2]
 */