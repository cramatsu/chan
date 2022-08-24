import { InjectDiscordClient } from '@discord-nestjs/core';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { application, Request, Response } from 'express';
import { Activity, ActivityType, Client, DiscordAPIError } from 'discord.js';
import { ApiHeader, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { UserBuilder } from './dto/user.entity';
import { BioPayload } from './dto/bio-payload';
import { json, text } from 'stream/consumers';
import { Validate } from 'class-validator';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { DiscordExceptionFilter } from './filters/discord-exception.filter';

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
  public async changeBio(@Body() body: BioPayload, @Req() req: Request) {
    const apiKey = req.header('x-api-key');

    console.log(body);
    const userId = await this.redis.get(`api_key:${apiKey}`);
    console.log(2);
    await this.redis.set(`user_bio:${userId}`, body.text);
    console.log(3);
  }

  @Get('/user/:id')
  @Header('content-type', 'application/json')
  @HttpCode(HttpStatus.OK)
  @UseFilters(new HttpExceptionFilter(), DiscordExceptionFilter)
  public async getUser(@Param('id') id: string) {
    const guild = this.client.guilds.cache.get(process.env.D_GUILD_ID);

    const member = await guild.members.fetch(id);

    const { clientStatus } = member.presence;
    const activities = member.presence.activities;
    const spotify = member.presence.activities.find(
      (it) => it.name === 'Spotify',
    );
    const activity = activities.find((it) => {
      return (
        it.type !== ActivityType.Custom && it.type !== ActivityType.Listening
      );
    });

    const userBuilder = new UserBuilder()
      .setBio((await this.redis.get(`user_bio:${id}`)) ?? null)
      .setDiscrim(+member.user.discriminator)
      .setActivity(
        activity
          ? {
              applicationId: activity.applicationId,
              assets: activity.assets,
              buttons: activity.buttons,
              createdTimestamp: activity.createdTimestamp,
              details: activity.details,
              name: activity.name,
              emoji: activity.emoji,
              state: activity.state,
              timestamps: activity.timestamps,
              type: activity.type,
              url: activity.url,
            }
          : null,
      )
      .setSpotify(
        spotify
          ? {
              cover: spotify.assets.largeImage
                ? `https://i.scdn.co/image/${
                    spotify.assets.largeImage.split(':')[1]
                  }`
                : null,
              artist: spotify.state.replace(';', ','),
              songName: spotify.details,
              timestamps: spotify.timestamps,
              albumName: spotify.assets.largeText,
              type: spotify.type,
            }
          : null,
      )
      .setStatus(member.presence.status)
      .setDesktopPlatform(!!clientStatus.desktop)
      .setWebPlatform(!!clientStatus.web)
      .setMobilePlatform(!!clientStatus.mobile)
      .setUsername(member.user.username)
      .setId(member.id)
      .build();

    return userBuilder;
  }
}
