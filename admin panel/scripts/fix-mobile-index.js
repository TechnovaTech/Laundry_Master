const { MongoClient } = require('mongodb');

async function fixMobileIndex() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('laundry');
    const collection = db.collection('customers');
    
    // Drop the unique index on mobile field
    try {
      await collection.dropIndex('mobile_1');
      console.log('✅ Dropped unique index on mobile field');
    } catch (error) {
      console.log('Index may not exist:', error.message);
    }
    
    // Create a new non-unique sparse index
    await collection.createIndex({ mobile: 1 }, { sparse: true });
    console.log('✅ Created new sparse index on mobile field');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixMobileIndex();