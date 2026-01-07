const { createClient } = require('redis');
require('dotenv').config({ path: '.env.local' });

const REDIS_URL = process.env.KV_URL || process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error('Error: KV_URL or REDIS_URL environment variable is required.');
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

    const trackedUsersKey = 'discord-activities:tracked-users';
    
    // Check type of key
    const type = await client.type(trackedUsersKey);
    console.log(`Current key type: ${type}`);
    
    if (type === 'string') {
        console.log('Detected old JSON list format (string). Deleting key to migrate to Redis Set...');
        await client.del(trackedUsersKey);
        console.log('Key deleted. It will be repopulated as a Set when users visit their profiles.');
    } else if (type === 'set') {
        console.log('Key is already a Set. No action needed.');
    } else if (type === 'none') {
        console.log('Key does not exist. No action needed.');
    } else {
        console.log(`Unexpected key type: ${type}. No action taken.`);
    }

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.disconnect();
  }
}

main();
