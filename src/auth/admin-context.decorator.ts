import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface AdminContext {
  id: number;
  email: string;
  name: string;
  phone: string;
}
export const Admin = createParamDecorator((data, ctx: ExecutionContext): AdminContext => {
  return ctx.switchToHttp().getRequest().user;
});
