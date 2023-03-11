import { createParamDecorator, ExecutionContext, } from "@nestjs/common";

export const UserId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest()?.user;
  }
)
