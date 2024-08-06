import { Controller, Get, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('session')
  getSession(@Session() session): string {
    session.views = session.views ? session.views + 1 : 1;
    return `Views: ${session.views}`;
  }
}
