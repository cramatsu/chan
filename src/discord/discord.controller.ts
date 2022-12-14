import { InjectDiscordClient } from '@discord-nestjs/core';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Client } from 'discord.js';
import { Request } from 'express';
import { BioPayload } from './dto/bio-payload';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { DiscordExceptionFilter } from './filters/discord-exception.filter';
import { minimalPresence, prettyPresence } from './utils/prettyPresence';

enum PresenceReturnType {
  MIN = 'min',
  DEFAULT = 'default',
}
@Controller('discord')
export class DiscordController {
  @InjectDiscordClient()
  private client: Client;

  @InjectRedis()
  private redis: Redis;

  @ApiResponse({
    status: 200,
  })
  @ApiHeader({
    required: true,
    name: 'x-api-key',
    description: 'Use the bot to get the key',
  })
  @UseGuards(AuthGuard('api-key'))
  @Header('content-type', 'application/json')
  @Patch('/bio')
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe())
  public async patchBio(@Body() body: BioPayload, @Req() req: Request) {
    const apiKey = req.header('x-api-key');

    const userId = await this.redis.get(`api_key:${apiKey}`);

    await this.redis.set(`user_bio:${userId}`, body.text);
  }

  @ApiQuery({
    description: 'Type of returing presence',
    required: false,
    enum: PresenceReturnType,
    allowEmptyValue: true,
    name: 'type',
  })
  @Get('/user/:id')
  @Header('content-type', 'application/json')
  @HttpCode(HttpStatus.OK)
  @UseFilters(new HttpExceptionFilter(), DiscordExceptionFilter)
  public async getUser(
    @Param('id') id: string,
    @Query('type') type?: PresenceReturnType,
  ) {
    const guild = this.client.guilds.cache.get(process.env.D_GUILD_ID);
    const member = await guild.members.fetch(id);

    if (type === 'min') {
      return minimalPresence(member);
    }

    const bio = (await this.redis.get(`user_bio:${id}`)) ?? null;
    return prettyPresence({ member, bio });
  }
}
