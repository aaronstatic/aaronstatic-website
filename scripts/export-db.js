const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const URI = process.env.MONGODB_URI;

if (!URI) {
    throw new Error('No Mongo URI found, add it to your .env file');
}

async function exportCollection(client, collectionName) {
    const db = client.db('aaronstatic');
    const collection = db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    
    // Create exports directory if it doesn't exist
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
    }
    
    // Write to file
    fs.writeFileSync(
        path.join(exportDir, `${collectionName}.json`),
        JSON.stringify(documents, null, 2)
    );
    
    console.log(`Exported ${documents.length} documents from ${collectionName}`);
}

async function exportDatabase() {
    const client = new MongoClient(URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        // Export each collection
        const collections = ['releases', 'mixes', 'projects', 'content'];
        for (const collection of collections) {
            await exportCollection(client, collection);
        }
        
        console.log('Database export completed successfully');
    } catch (error) {
        console.error('Error exporting database:', error);
    } finally {
        await client.close();
    }
}

exportDatabase(); 