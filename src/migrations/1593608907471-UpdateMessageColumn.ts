import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMessageColumn1593608907471 implements MigrationInterface {
    name = 'UpdateMessageColumn1593608907471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "template_id"`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD "message_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "notification_count"`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD "notification_count" character varying`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD CONSTRAINT "FK_b815ad89b6b4a1074a8eb547195" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP CONSTRAINT "FK_b815ad89b6b4a1074a8eb547195"`);
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "notification_count"`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD "notification_count" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_status" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users_config" ALTER COLUMN "notification_status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP COLUMN "message_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "template_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b" FOREIGN KEY ("template_id") REFERENCES "messages_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
