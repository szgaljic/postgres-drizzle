const { Client } = require('pg');
const readline = require('readline');
const dotenv = require('dotenv');

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

async function dropDatabase() {
  let client;
  try {
    const connectionInfo = parsePostgresUrl(process.env.POSTGRES_URL);
    const dbName = connectionInfo.database;

    // Create a connection to postgres to drop the database
    client = new Client({
      host: connectionInfo.host,
      port: connectionInfo.port,
      user: connectionInfo.user,
      password: connectionInfo.password,
      database: 'postgres', // Connect to default postgres database
      ssl: { rejectUnauthorized: false }
    });

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
    if (client) {
      await client.end();
    }
    rl.close();
  }
}

dropDatabase();
