const { createClient } = require('redis');
require('dotenv').config({ path: '.env.local' }); // Try to load .env.local

const REDIS_URL = process.env.KV_URL || process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error('Error: KV_URL or REDIS_URL environment variable is required.');
  console.error('Make sure you have a .env.local file or set the environment variables.');
  process.exit(1);
}

async function main() {
  const client = createClient({
    url: REDIS_URL,
    socket: {
      tls: REDIS_URL.startsWith('rediss://') || REDIS_URL.includes(':6380'),
    },
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));

  try {
    await client.connect();
    console.log('Connected to Redis.');

    console.log('Flushing database...');
    await client.flushDb();
    console.log('Database cleanup complete. All keys have been removed.');

  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    await client.disconnect();
  }
}

main();
