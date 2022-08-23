import { DiscordModule } from '@discord-nestjs/core';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayIntentBits } from 'discord.js';
import { DiscordModule as DModule } from './discord/discord.module';
import { AuthModule } from './auth/auth.module';
import { SlashCommandsModule } from './discord/slash-commands/slash-commands.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      config: {
        port: 6379,
        host: 'localhost',
      },
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (config: ConfigService) => ({
        autoLogin: true,
        token: config.get('D_TOKEN'),
        discordClientOptions: {
          ws: {
            properties: {
              browser: 'Discord iOS',
            },
          },
          intents: [
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.Guilds,
          ],
        },
        registerCommandOptions: [
          {
            removeCommandsBefore: true,
            forGuild: config.get('D_GUILD_ID'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    DModule,
    AuthModule,
    SlashCommandsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
