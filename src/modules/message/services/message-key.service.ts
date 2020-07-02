import { MessageKeyRepository } from '../repositories';
import { Injectable } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { MessageKeyEntity } from '../entities';

@Injectable()
export class MessageKeyService {
  private readonly _messageKeys = [{ name: 'WELCOME_MESSAGE' }];

  constructor(private readonly _messageKeyRepository: MessageKeyRepository) {}

  public async getMessageKey(
    uuid: string,
  ): Promise<MessageKeyEntity | undefined> {
    const queryBuilder = this._messageKeyRepository.createQueryBuilder(
      'messageKey',
    );

    queryBuilder.where('messageKey.uuid = :uuid', { uuid });

    return queryBuilder.getOne();
  }

  public async setMessageKeys(): Promise<void> {
    for (const { name } of this._messageKeys) {
      await this._createMessageKeys(name);
    }
  }

  private async _createMessageKeys(name: string): Promise<InsertResult> {
    const queryBuilder = this._messageKeyRepository.createQueryBuilder(
      'message_key',
    );

    return queryBuilder
      .insert()
      .values({ name })
      .onConflict(
        `("name") DO UPDATE 
          SET name = :name`,
      )
      .setParameter('name', name)
      .execute();
  }
}
