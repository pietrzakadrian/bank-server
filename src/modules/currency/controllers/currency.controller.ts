'use strict';

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrenciesPageDto, CurrenciesPageOptionsDto } from '../dto';
import { CurrencyService } from '../services';

@Controller('Currencies')
@ApiTags('Currencies')
export class CurrencyController {
    constructor(private readonly _currencyService: CurrencyService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get currency',
        type: CurrenciesPageDto,
    })
    async getAvailableCurrencies(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: CurrenciesPageOptionsDto,
    ): Promise<CurrenciesPageDto | any> {
        return this._currencyService.getCurrencies(pageOptionsDto);
    }
}
