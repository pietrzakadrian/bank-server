import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDefaultValues1586122671997 implements MigrationInterface {
    name = 'updateDefaultValues1586122671997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" ALTER COLUMN "main" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "authorization_status" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_status" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_count" SET DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_status" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_count" SET DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_count" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "message_status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_count" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "authorization_status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "currency" ALTER COLUMN "main" DROP DEFAULT`, undefined);
    }

}
