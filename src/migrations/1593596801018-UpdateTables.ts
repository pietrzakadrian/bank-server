import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTables1593596801018 implements MigrationInterface {
    name = 'UpdateTables1593596801018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP CONSTRAINT "FK_b815ad89b6b4a1074a8eb547195"`);
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP COLUMN "message_id"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "template_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b" FOREIGN KEY ("template_id") REFERENCES "messages_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "template_id"`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD "message_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD CONSTRAINT "FK_b815ad89b6b4a1074a8eb547195" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
