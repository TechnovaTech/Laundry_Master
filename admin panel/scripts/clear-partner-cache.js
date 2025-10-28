const { MongoClient } = require('mongodb');

async function clearPartnerCache() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('laundry');
    
    // Check current partner schema
    const partners = db.collection('partners');
    const indexes = await partners.indexes();
    console.log('Current partner indexes:', indexes);
    
    // Drop and recreate collection if needed
    const count = await partners.countDocuments();
    console.log('Partner documents count:', count);
    
    if (count === 0) {
      await partners.drop();
      console.log('✅ Dropped empty partners collection');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

clearPartnerCache();