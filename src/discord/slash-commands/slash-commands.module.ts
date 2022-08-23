import { Module } from '@nestjs/common';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';

@InjectDynamicProviders('dist/**/*.command.js')
@Module({})
export class SlashCommandsModule {}
