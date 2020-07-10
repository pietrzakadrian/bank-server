import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateColumn1594370681433 implements MigrationInterface {
    name = 'UpdateColumn1594370681433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP COLUMN "actions"`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD "actions" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP COLUMN "actions"`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD "actions" character varying`);
    }

}
