import pg from 'pg';
import readline from 'readline';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Client } = pg;
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function checkDatabaseExists(client, dbName) {
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName]
  );
  return result.rows.length > 0;
}

async function dropDatabase() {
  // Extract database name from connection string
  const url = new URL(process.env.POSTGRES_URL);
  const dbName = url.pathname.slice(1); // Remove leading slash

  // Create a connection to postgres to drop the database
  const client = new Client({
    host: url.hostname,
    port: url.port,
    user: url.username,
    password: url.password,
    database: 'postgres', // Connect to default postgres database
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Check if database exists
    const exists = await checkDatabaseExists(client, dbName);
    
    if (!exists) {
      console.log(`Database '${dbName}' does not exist.`);
      process.exit(0);
    }

    console.log(`\nWARNING: You are about to drop the database: ${dbName}`);
    console.log('This action cannot be undone!\n');

    const answer = await new Promise((resolve) => {
      rl.question('Are you sure you want to proceed? Type Y to confirm: ', resolve);
    });

    if (answer.toLowerCase() !== 'y') {
      console.log('Operation cancelled.');
      process.exit(0);
    }
    
    // Terminate all connections to the database
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
      AND pid <> pg_backend_pid();
    `);

    // Drop the database
    await client.query(`DROP DATABASE IF EXISTS ${dbName};`);
    
    console.log(`Successfully dropped database: ${dbName}`);
  } catch (err) {
    console.error('Error dropping database:', err);
    process.exit(1);
  } finally {
    await client.end();
    rl.close();
  }
}

dropDatabase();
