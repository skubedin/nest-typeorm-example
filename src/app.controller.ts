import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Abilities } from './casl/decorators/abilities.decorator';
import { AbilityGuard } from './casl/guards/ability.guard';
import { Action, Subject } from './common/roles/constants';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthz')
  @Abilities({ subject: Subject.SCHEME, action: Action.Manage })
  @UseGuards(AbilityGuard)
  healthz(): string {
    return "I'm OK! -_o";
  }
}
