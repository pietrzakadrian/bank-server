import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTable1593645407875 implements MigrationInterface {
    name = 'UpdateTable1593645407875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_keys" ADD CONSTRAINT "UQ_20fcc658d294835abbdcce5d1b6" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_keys" DROP CONSTRAINT "UQ_20fcc658d294835abbdcce5d1b6"`);
    }

}
