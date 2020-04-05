import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTransactionsTable1586117686105 implements MigrationInterface {
    name = 'CreateTransactionsTable1586117686105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount_money" numeric(13,2) NOT NULL DEFAULT 0, "transfer_title" character varying NOT NULL, "authorization_key" character varying NOT NULL, "authorization_status" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "sender_account_bill_id" integer NOT NULL, "recipient_account_bill_id" integer NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_b90513525303415ff06e296fd50" FOREIGN KEY ("sender_account_bill_id") REFERENCES "bills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_1b66f4390851be350acec660730" FOREIGN KEY ("recipient_account_bill_id") REFERENCES "bills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_1b66f4390851be350acec660730"`, undefined);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_b90513525303415ff06e296fd50"`, undefined);
        await queryRunner.query(`DROP TABLE "transactions"`, undefined);
    }

}
