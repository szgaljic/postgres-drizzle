import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require', max: 1 });
  const db = drizzle(sql);

  console.log('⏳ Running migrations...');
  
  const start = Date.now();
  await migrate(db, { migrationsFolder: 'drizzle' });
  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
