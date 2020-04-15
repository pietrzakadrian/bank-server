import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateBills1586937579581 implements MigrationInterface {
    name = 'UpdateBills1586937579581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" ADD "amount_money" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "amount_money"`, undefined);
    }

}
