import { AbstractEntity } from 'common/entities';
import { LanguageDto } from 'modules/language/dtos';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'languages' })
export class LanguageEntity extends AbstractEntity<LanguageDto> {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  dtoClass = LanguageDto;
}
