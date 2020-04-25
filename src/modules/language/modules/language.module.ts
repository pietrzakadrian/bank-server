import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageRepository } from 'modules/language/repositories';
import { LanguageService } from 'modules/language/services';

@Module({
    imports: [TypeOrmModule.forFeature([LanguageRepository])],
    controllers: [],
    exports: [LanguageService],
    providers: [LanguageService],
})
export class LanguageModule {}
