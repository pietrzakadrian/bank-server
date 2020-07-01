import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserConfigTable1593636719489 implements MigrationInterface {
    name = 'UpdateUserConfigTable1593636719489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "notification_status"`);
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "message_status"`);
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "notification_count"`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD "notification_count" integer`);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_count" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_count" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "notification_count"`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD "notification_count" character varying`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD "message_status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD "notification_status" boolean`);
    }

}
