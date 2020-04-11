import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserConfigTable1586539436223 implements MigrationInterface {
    name = 'UpdateUserConfigTable1586539436223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" ADD "last_present_logged_date" TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_config" DROP COLUMN "last_present_logged_date"`, undefined);
    }

}
