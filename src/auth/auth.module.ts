import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HeaderApiKeyStrategy } from './strategies/auth-header-api-key.strategy';

@Module({
  providers: [AuthService, HeaderApiKeyStrategy],
  exports: [AuthService],
})
export class AuthModule {}
