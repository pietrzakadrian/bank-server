import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTables1592226545471 implements MigrationInterface {
    name = 'UpdateTables1592226545471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_b90513525303415ff06e296fd50"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_1b66f4390851be350acec660730"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "sender_account_bill_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "recipient_account_bill_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "sender_bill_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "recipient_bill_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_68ae22d45b24ca14f515b091cdf" FOREIGN KEY ("sender_bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_792b9a2f2ea2674afc63ef57803" FOREIGN KEY ("recipient_bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_792b9a2f2ea2674afc63ef57803"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_68ae22d45b24ca14f515b091cdf"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "recipient_bill_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "sender_bill_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "recipient_account_bill_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "sender_account_bill_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_1b66f4390851be350acec660730" FOREIGN KEY ("recipient_account_bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_b90513525303415ff06e296fd50" FOREIGN KEY ("sender_account_bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
