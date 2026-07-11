import 'dotenv/config';
import { DataSource } from 'typeorm';

const port = Number(process.env.DATABASE_PORT ?? 5432);

// Gives TypeORM CLI commands the same PostgreSQL settings as the Nest app.
export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port,
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'booking_platform',
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
});
