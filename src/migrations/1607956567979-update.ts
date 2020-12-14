import {MigrationInterface, QueryRunner} from "typeorm";

export class update1607956567979 implements MigrationInterface {
    name = 'update1607956567979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_auth_forgotten_passwords" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "used" boolean NOT NULL DEFAULT false, "hashed_token" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_3eb006035a66fb6fb8c5e8dce58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_auth_forgotten_passwords" ADD CONSTRAINT "FK_957a4df663028f6f9a9cb39948c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_auth_forgotten_passwords" DROP CONSTRAINT "FK_957a4df663028f6f9a9cb39948c"`);
        await queryRunner.query(`DROP TABLE "users_auth_forgotten_passwords"`);
    }

}
