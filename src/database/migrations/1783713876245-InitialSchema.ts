import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1783713876245 implements MigrationInterface {
  name = 'InitialSchema1783713876245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_name" character varying(150) NOT NULL, "customer_email" character varying(254) NOT NULL, "customer_phone" character varying(30) NOT NULL, "service_id" uuid NOT NULL, "booking_date" date NOT NULL, "booking_time" TIME NOT NULL, "status" "public"."booking_status" NOT NULL DEFAULT 'PENDING', "notes" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150) NOT NULL, "description" text NOT NULL, "duration" integer NOT NULL, "price" numeric(10,2) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_df22e2beaabc33a432b4f65e3c2" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_service_date_time" ON "bookings" ("service_id", "booking_date", "booking_time")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bookings_service_date_time"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_bookings_status"`);
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_df22e2beaabc33a432b4f65e3c2"`,
    );
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "public"."booking_status"`);
  }
}
