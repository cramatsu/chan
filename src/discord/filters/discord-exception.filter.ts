import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DiscordAPIError } from 'discord.js';
import { Response } from 'express';

@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  catch(exception: DiscordAPIError, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const messageRegexp = new RegExp('(?<=:.).*', 'gi');

    const anoterMessage = messageRegexp.exec(exception.message);
    console.log(anoterMessage);
    if (anoterMessage !== null) {
      return response.status(response.statusCode).json({
        message: anoterMessage[0],
      });
    }
    return response.status(response.statusCode).json({
      message: exception.message,
    });
  }
}
