import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class BioPayload {
  @MaxLength(200)
  @ApiProperty()
  public text: string;
}
