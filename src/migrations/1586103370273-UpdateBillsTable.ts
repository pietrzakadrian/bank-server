import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateBillsTable1586103370273 implements MigrationInterface {
    name = 'UpdateBillsTable1586103370273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" ADD "currency_id" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "FK_b93c85bb219680f864ad92605a5" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "FK_b93c85bb219680f864ad92605a5"`, undefined);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "currency_id"`, undefined);
    }

}
