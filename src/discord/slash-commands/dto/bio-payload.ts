import { MaxLength } from 'class-validator';

export class BioPayload {
  @MaxLength(200)
  public text: string;
}
