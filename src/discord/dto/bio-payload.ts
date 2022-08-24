import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class BioPayload {
  @MaxLength(200)
  @ApiProperty({
    maxLength: 200,
    example: 'I love boobies-whoooopies',
  })
  public text: string;
}
