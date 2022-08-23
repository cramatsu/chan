import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  public constructor(@InjectRedis() private redis: Redis) {}

  public async validateApiKey(key: string) {
    const isExist = await this.redis.exists(`api_key:${key}`);
    return isExist;
  }
}
