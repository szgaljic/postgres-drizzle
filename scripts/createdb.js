import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Client } = pg;
dotenv.config();

async function checkDatabaseExists(client, dbName) {
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName]
  );
  return result.rows.length > 0;
}

async function createDatabase() {
  // Extract database name from connection string
  const url = new URL(process.env.POSTGRES_URL);
  const dbName = url.pathname.slice(1); // Remove leading slash

  // Create a connection to postgres to create the database
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

    // Check if database already exists
    const exists = await checkDatabaseExists(client, dbName);
    
    if (exists) {
      console.log(`Database '${dbName}' already exists.`);
      return;
    }

    // Create the database
    await client.query(`CREATE DATABASE ${dbName};`);
    console.log(`Successfully created database: ${dbName}`);

  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
