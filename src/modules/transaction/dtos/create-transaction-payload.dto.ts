import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionPayloadDto {
  @ApiProperty()
  readonly uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }
}
