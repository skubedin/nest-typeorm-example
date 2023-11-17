import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Abilities } from './casl/decorators/abilities.decorator';
import { AbilityGuard } from './casl/guards/ability.guard';
import { Action, Subject } from './common/roles/constants';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('healthz')
  @Abilities({ subject: Subject.SCHEME, action: Action.MANAGE })
  @UseGuards(AbilityGuard)
  healthz(): string {
    return "I'm OK! -_o";
  }
}
