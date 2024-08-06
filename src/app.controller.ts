import {
  Controller,
  Get,
  Headers,
  Inject,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(LoginGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('session')
  @UseGuards(LoginGuard)
  getSession(@Session() session): string {
    session.views = session.views ? session.views + 1 : 1;
    return `Views: ${session.views}`;
  }

  @Get('jwt')
  @UseGuards(LoginGuard)
  getJwt(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ): number {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data = this.jwtService.verify(token);
        const newToken = this.jwtService.sign({ count: data.count + 1 });
        response.setHeader('token', newToken);
        return data.count + 1;
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({ count: 1 });
      response.setHeader('token', newToken);
      return 1;
    }
  }
}
