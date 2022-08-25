import { Module } from '@nestjs/common';
import { DiscordModule as Discord } from '@discord-nestjs/core';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { SlashCommandsModule } from './slash-commands/slash-commands.module';

@Module({
  imports: [Discord.forFeature(), SlashCommandsModule],
  controllers: [DiscordController],
  providers: [DiscordService],
})
export class DiscordModule {}
