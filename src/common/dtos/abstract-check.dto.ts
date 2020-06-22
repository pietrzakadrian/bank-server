import { ApiProperty } from '@nestjs/swagger';

export class AbstractCheckDto {
  @ApiProperty()
  readonly exist: boolean;

  constructor(exist: any) {
    this.exist = exist ? true : false;
  }
}
