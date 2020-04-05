import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserConfigTable1586104994899 implements MigrationInterface {
    name = 'CreateUserConfigTable1586104994899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_config" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_status" boolean NOT NULL, "notification_count" integer NOT NULL, "message_status" boolean NOT NULL, "message_count" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "REL_6deb66d33458d7afbf9ae3efd7" UNIQUE ("user_id"), CONSTRAINT "PK_b529cae1138818ca95223e95db8" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "users_config" ADD CONSTRAINT "FK_6deb66d33458d7afbf9ae3efd73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" DROP CONSTRAINT "FK_6deb66d33458d7afbf9ae3efd73"`, undefined);
        await queryRunner.query(`DROP TABLE "users_config"`, undefined);
    }

}
