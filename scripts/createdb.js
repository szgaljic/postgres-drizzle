require('dotenv').config();
const { execSync } = require('child_process');
const url = require('url');

// Get the connection URL from env
const connectionUrl = process.env.POSTGRES_URL;

if (!connectionUrl) {
  console.error('Error: POSTGRES_URL not found in environment variables');
  process.exit(1);
}

// Parse the connection URL
const parsedUrl = new url.URL(connectionUrl);
const dbName = parsedUrl.pathname.split('/').pop();
const host = parsedUrl.hostname;
const port = parsedUrl.port;
const username = parsedUrl.username;
const password = parsedUrl.password;

// Create environment with PGPASSWORD
const env = {
  ...process.env,
  PGPASSWORD: password
};

// Test connection first
try {
  console.log('Testing database connection...');
  execSync(`pg_isready -h ${host} -p ${port} -U ${username}`, { stdio: 'inherit', env });
} catch (error) {
  console.error('Failed to connect to database server:', error.message);
  process.exit(1);
}

// Function to check if database exists
function checkDatabaseExists() {
  try {
    const result = execSync(
      `psql -h ${host} -p ${port} -U ${username} -d postgres -t -A -c "SELECT 1 FROM pg_database WHERE datname='${dbName}'"`,
      { encoding: 'utf-8', env }
    ).trim();
    return result === '1';
  } catch (error) {
    console.error('Error checking database:', error.message);
    return false;
  }
}

// First check if database already exists
if (checkDatabaseExists()) {
  console.log(`Database ${dbName} already exists.`);
  
  // List databases
  console.log('\nCurrent databases:');
  try {
    execSync(
      `psql -h ${host} -p ${port} -U ${username} -d postgres -c "\\l"`,
      { stdio: 'inherit', env }
    );
  } catch (error) {
    console.error('Error listing databases:', error.message);
  }
  
  process.exit(0);
}

try {
  // Try to create the database
  console.log(`Creating database ${dbName}...`);
  execSync(
    `psql -h ${host} -p ${port} -U ${username} -d postgres -c "CREATE DATABASE ${dbName}"`,
    { stdio: 'inherit', env }
  );
  
  // Verify the database was created
  if (checkDatabaseExists()) {
    console.log(`Database ${dbName} created and verified successfully!`);
    
    // Show the database in the list
    console.log('\nCurrent databases:');
    execSync(
      `psql -h ${host} -p ${port} -U ${username} -d postgres -c "\\l"`,
      { stdio: 'inherit', env }
    );
  } else {
    console.error('Database creation failed: Database not found after creation attempt');
    process.exit(1);
  }
} catch (error) {
  console.error('Error creating database:', error.message);
  process.exit(1);
}
