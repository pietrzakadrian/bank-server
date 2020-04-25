import { AbstractEntity } from 'common/entities';
import { Column, Entity } from 'typeorm';

import { LanguageDto } from '../dto';

@Entity({ name: 'languages' })
export class LanguageEntity extends AbstractEntity<LanguageDto> {
    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    code: string;

    dtoClass = LanguageDto;
}
