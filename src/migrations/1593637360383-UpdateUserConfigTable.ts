import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserConfigTable1593637360383 implements MigrationInterface {
    name = 'UpdateUserConfigTable1593637360383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "updated_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
    }

}
