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

    const clarificationMessage = messageRegexp.exec(exception.message);

    if (clarificationMessage !== null) {
      return response.status(response.statusCode).json({
        message: clarificationMessage[0]?.toUpperCase(),
      });
    }
    return response.status(response.statusCode).json({
      message: exception.message?.toUpperCase(),
    });
  }
}
