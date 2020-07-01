import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMessageTable1593592984617 implements MigrationInterface {
    name = 'CreateMessageTable1593592984617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages_templates" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "subject" character varying NOT NULL, "content" text NOT NULL, "actions" character varying, "message_id" integer NOT NULL, "language_id" integer NOT NULL, CONSTRAINT "PK_deb745ed42bbcbc413ac15feadc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "readed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "sender_id" integer NOT NULL, "recipient_id" integer NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD CONSTRAINT "FK_b815ad89b6b4a1074a8eb547195" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages_templates" ADD CONSTRAINT "FK_8b7fae297d45bdc3b170e047832" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_566c3d68184e83d4307b86f85ab" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_566c3d68184e83d4307b86f85ab"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP CONSTRAINT "FK_8b7fae297d45bdc3b170e047832"`);
        await queryRunner.query(`ALTER TABLE "messages_templates" DROP CONSTRAINT "FK_b815ad89b6b4a1074a8eb547195"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "messages_templates"`);
    }

}
