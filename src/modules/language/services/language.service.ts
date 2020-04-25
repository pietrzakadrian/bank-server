import { Injectable } from '@nestjs/common';
import { InsertResult } from 'typeorm';

import { LanguageRepository } from '../repositories';

@Injectable()
export class LanguageService {
    private readonly _languages = [
        { name: 'Polish', code: 'PL' },
        { name: 'English', code: 'EN' },
        { name: 'German', code: 'DE' },
    ];

    constructor(private readonly _languageRepository: LanguageRepository) {}

    public async setLanguages(): Promise<void> {
        for await (const language of this._languages) {
            this._createLanguage(language.name, language.code);
        }
    }

    private async _createLanguage(
        name: string,
        code: string,
    ): Promise<InsertResult> {
        const queryBuilder = this._languageRepository.createQueryBuilder(
            'currency',
        );

        return queryBuilder
            .insert()
            .values({ name, code })
            .onConflict(
                `("name") DO UPDATE
                SET name = :name`,
            )
            .setParameter('name', name)
            .execute();
    }
}
