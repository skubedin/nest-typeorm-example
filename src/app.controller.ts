import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsPublic } from './auth/guards/is-public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('healthz')
  @IsPublic()
  // @Abilities({ subject: Subject.SCHEME, action: Action.MANAGE })
  // @UseGuards(AbilityGuard)
  healthz(): string {
    return "I'm OK! -_o";
  }
}
