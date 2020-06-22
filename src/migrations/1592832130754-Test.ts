import {MigrationInterface, QueryRunner} from "typeorm";

export class Test1592832130754 implements MigrationInterface {
    name = 'Test1592832130754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "users_auth_role_enum" AS ENUM('USER_ROLE', 'ADMIN_ROLE')`);
        await queryRunner.query(`CREATE TABLE "users_auth" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "users_auth_role_enum" NOT NULL DEFAULT 'USER_ROLE', "pin_code" integer NOT NULL, "password" character varying NOT NULL, "last_successful_logged_date" TIMESTAMP, "last_failed_logged_date" TIMESTAMP, "last_logout_date" TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "UQ_e408bc41761f8c34601a140899f" UNIQUE ("pin_code"), CONSTRAINT "REL_8d4681a2d24fe0a272f0f6cce7" UNIQUE ("user_id"), CONSTRAINT "PK_32ddc1ae708e8261a870a6eb3e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_config" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_status" boolean NOT NULL DEFAULT false, "notification_count" integer NOT NULL DEFAULT 0, "message_status" boolean NOT NULL DEFAULT false, "message_count" integer NOT NULL DEFAULT 0, "last_present_logged_date" TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" integer NOT NULL, "main_currency_id" integer NOT NULL, CONSTRAINT "REL_6deb66d33458d7afbf9ae3efd7" UNIQUE ("user_id"), CONSTRAINT "PK_b529cae1138818ca95223e95db8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "current_exchange_rate" double precision NOT NULL, "base" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_77f11186dd58a8d87ad5fff0246" UNIQUE ("name"), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount_money" numeric(13,2) NOT NULL DEFAULT 0, "transfer_title" character varying NOT NULL, "authorization_key" character varying NOT NULL, "authorization_status" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "sender_bill_id" integer NOT NULL, "recipient_bill_id" integer NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bills" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_bill_number" character varying(26) NOT NULL, "amount_money" character varying, "user_id" integer NOT NULL, "currency_id" integer NOT NULL, CONSTRAINT "UQ_d727ad9f27fdb9d82e43cf04cbc" UNIQUE ("account_bill_number"), CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "UQ_9c0e155475f0aa782e4a6178969" UNIQUE ("name"), CONSTRAINT "UQ_7397752718d1c9eb873722ec9b2" UNIQUE ("code"), CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_auth" ADD CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD CONSTRAINT "FK_6deb66d33458d7afbf9ae3efd73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_config" ADD CONSTRAINT "FK_cfe02146c720891eca7a46d7fb8" FOREIGN KEY ("main_currency_id") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_68ae22d45b24ca14f515b091cdf" FOREIGN KEY ("sender_bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_792b9a2f2ea2674afc63ef57803" FOREIGN KEY ("recipient_bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "FK_03e3fcf1580c70bb68aedb999bf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bills" ADD CONSTRAINT "FK_b93c85bb219680f864ad92605a5" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "FK_b93c85bb219680f864ad92605a5"`);
        await queryRunner.query(`ALTER TABLE "bills" DROP CONSTRAINT "FK_03e3fcf1580c70bb68aedb999bf"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_792b9a2f2ea2674afc63ef57803"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_68ae22d45b24ca14f515b091cdf"`);
        await queryRunner.query(`ALTER TABLE "users_config" DROP CONSTRAINT "FK_cfe02146c720891eca7a46d7fb8"`);
        await queryRunner.query(`ALTER TABLE "users_config" DROP CONSTRAINT "FK_6deb66d33458d7afbf9ae3efd73"`);
        await queryRunner.query(`ALTER TABLE "users_auth" DROP CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TABLE "bills"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "currency"`);
        await queryRunner.query(`DROP TABLE "users_config"`);
        await queryRunner.query(`DROP TABLE "users_auth"`);
        await queryRunner.query(`DROP TYPE "users_auth_role_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
