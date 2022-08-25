import { Command, DiscordCommand } from '@discord-nestjs/core';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import {
  bold,
  CommandInteraction,
  EmbedBuilder,
  spoiler,
  time,
} from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

@Command({
  name: 'api',
  description: 'Generate an API key',
})
@Injectable()
export class ApiKeyCommand implements DiscordCommand {
  @InjectRedis()
  redis: Redis;

  async handler(int: CommandInteraction) {
    await int.deferReply({
      ephemeral: true,
    });
    const isKeyExists = await this.redis.get(`user_api_key:${int.user.id}`);
    if (isKeyExists) {
      await int.editReply('You have already made an API KEY');
      return;
    }

    const generatedKey = uuidv4();

    await int.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(bold('I sent your key in direct'))
          .setColor('Blurple'),
      ],
    });

    try {
      const userDirect = await int.user.createDM();

      const expireDate = new Date().setDate(new Date().getDate() + 7);
      await userDirect.send({
        embeds: [
          new EmbedBuilder()
            .addFields([
              {
                name: '> API KEY',
                value: `${spoiler(generatedKey)}`,
              },
              {
                name: '> Expires',
                value: time(Math.floor(expireDate / 1000)),
              },
            ])
            .setFooter({
              text: 'Do not share the key with anyone!',
            })
            .setColor('White'),
        ],
      });
    } catch (e) {
      console.log(e);
    }

    await this.redis.setex(
      `api_key:${generatedKey}`,
      60 * 60 * 24 * 31,
      int.user.id,
    );
    await this.redis.setex(
      `user_api_key:${int.user.id}`,
      60 * 60 * 24 * 31,
      generatedKey,
    );
  }
}
