import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTable1587753626142 implements MigrationInterface {
    name = 'UpdateTable1587753626142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`, undefined);
        await queryRunner.query(`ALTER TABLE "users_auth" ADD "last_logout_date" TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_auth" DROP COLUMN "last_logout_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`, undefined);
    }

}
