const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const URI = "mongodb://127.0.0.1:27017/aaronstatic"

if (!URI) {
    throw new Error('No Mongo URI found, add it to your .env file');
}

async function importCollection(client, collectionName) {
    const db = client.db('aaronstatic');
    const collection = db.collection(collectionName);
    
    // Read the JSON file
    const filePath = path.join(__dirname, 'exports', `${collectionName}.json`);
    if (!fs.existsSync(filePath)) {
        console.log(`No export file found for ${collectionName}`);
        return;
    }
    
    const documents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Clear existing collection
    await collection.deleteMany({});
    
    // Insert all documents
    if (documents.length > 0) {
        await collection.insertMany(documents);
        console.log(`Imported ${documents.length} documents into ${collectionName}`);
    } else {
        console.log(`No documents to import for ${collectionName}`);
    }
}

async function importDatabase() {
    const client = new MongoClient(URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        // Import each collection
        const collections = ['releases', 'mixes', 'projects', 'content'];
        for (const collection of collections) {
            await importCollection(client, collection);
        }
        
        console.log('Database import completed successfully');
    } catch (error) {
        console.error('Error importing database:', error);
    } finally {
        await client.close();
    }
}

importDatabase(); 