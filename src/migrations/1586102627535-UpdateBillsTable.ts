import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateBillsTable1586102627535 implements MigrationInterface {
    name = 'UpdateBillsTable1586102627535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" ADD "user_id" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "FK_03e3fcf1580c70bb68aedb999bf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "FK_03e3fcf1580c70bb68aedb999bf"`, undefined);
        await queryRunner.query(`ALTER TABLE "bills" DROP COLUMN "user_id"`, undefined);
    }

}
