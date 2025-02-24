const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function checkDatabaseExists(client, dbName) {
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName]
  );
  return result.rows.length > 0;
}

function parsePostgresUrl(url) {
  // postgresql://user:password@host:port/dbname
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid PostgreSQL URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5]
  };
}

async function createDatabase() {
  let client;
  try {
    const connectionInfo = parsePostgresUrl(process.env.POSTGRES_URL);
    const dbName = connectionInfo.database;

    // Create a connection to postgres to create the database
    client = new Client({
      host: connectionInfo.host,
      port: connectionInfo.port,
      user: connectionInfo.user,
      password: connectionInfo.password,
      database: 'postgres', // Connect to default postgres database
      ssl: { rejectUnauthorized: false }
    });

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
    if (client) {
      await client.end();
    }
  }
}

createDatabase();
