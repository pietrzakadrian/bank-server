import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBillsTable1586101716311 implements MigrationInterface {
    name = 'CreateBillsTable1586101716311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bills" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_bill" character varying NOT NULL, CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bills"`, undefined);
    }

}
