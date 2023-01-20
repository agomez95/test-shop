import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest(); /// con esto traigo un request almacenados en mi peticion http
    const user = req.user;
    if(!user) throw new InternalServerErrorException('User not found(req)');
    return (!data) ? user : user[data] 
})

    /*if(data){
        switch(data) {
            case "id":
                return user.id;
                break;
            case "fullname":
                return user.fullname;
                break;
            case "email":
                return user.email;
                break;
            default:
                return user;
        }
    } else {
        return user;
    } ---Mi forma*/