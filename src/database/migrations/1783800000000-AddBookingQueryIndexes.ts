import { MigrationInterface, QueryRunner } from 'typeorm';

// Adds indexes that back booking pagination ordering and customer search.
export class AddBookingQueryIndexes1783800000000 implements MigrationInterface {
  name = 'AddBookingQueryIndexes1783800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Backs the default newest-first ORDER BY used by pagination.
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_created_at" ON "bookings" ("created_at")`,
    );
    // Enables trigram GIN indexes so ILIKE customer search stays index-backed.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_customer_name_trgm" ON "bookings" USING gin ("customer_name" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_customer_email_trgm" ON "bookings" USING gin ("customer_email" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_customer_phone_trgm" ON "bookings" USING gin ("customer_phone" gin_trgm_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bookings_customer_phone_trgm"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bookings_customer_email_trgm"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bookings_customer_name_trgm"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_bookings_created_at"`);
  }
}
