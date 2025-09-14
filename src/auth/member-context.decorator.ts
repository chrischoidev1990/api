import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface MemberContext {
  id: number;
  email: string;
  name: string;
  phone: string;
}
export const Member = createParamDecorator((data, ctx: ExecutionContext): MemberContext => {
  return ctx.switchToHttp().getRequest().user;
});
