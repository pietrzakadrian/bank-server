import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCurrencyTable1586090780774 implements MigrationInterface {
    name = 'CreateCurrencyTable1586090780774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "current_exchange_rate" integer NOT NULL, "main" boolean NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "avatar" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "users_auth_role_enum" AS ENUM('USER_ROLE', 'ADMIN_ROLE')`, undefined);
        await queryRunner.query(`CREATE TABLE "users_auth" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "users_auth_role_enum" NOT NULL DEFAULT 'USER_ROLE', "pin_code" integer NOT NULL, "password" character varying NOT NULL, "last_successful_logged_date" TIMESTAMP NOT NULL, "last_failed_logged_date" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "REL_8d4681a2d24fe0a272f0f6cce7" UNIQUE ("user_id"), CONSTRAINT "PK_32ddc1ae708e8261a870a6eb3e6" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "users_auth" ADD CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_auth" DROP CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f"`, undefined);
        await queryRunner.query(`DROP TABLE "users_auth"`, undefined);
        await queryRunner.query(`DROP TYPE "users_auth_role_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "users"`, undefined);
        await queryRunner.query(`DROP TABLE "currency"`, undefined);
    }

}
