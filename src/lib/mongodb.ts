import { MongoClient, WithId } from "mongodb";
import * as dotenv from "dotenv";
import Release from "./types/Release";
import { Content } from "./types/Content";
import Mix from "./types/Mix";
import Project from "./types/Project";
dotenv.config();

const URI = process.env.MONGODB_URI;

if (!URI) {
    throw new Error("No Mongo URI found, add it to your .env file");
}

const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(URI, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(URI, options);
    clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get the database instance
export async function getDb() {
    const client = await clientPromise;
    return client.db("aaronstatic");
}

const mapRelease = (doc: any): Release => ({
    id: doc.id,
    name: doc.name,
    release_date: doc.release_date,
    album_type: doc.album_type,
    images: doc.images,
    album_group: doc.album_group,
    external_urls: doc.external_urls,
    artists: doc.artists,
    tracks: doc.tracks.items,
    popularity: doc.popularity,
    genres: doc.genres,
    label: doc.label,
    description: doc.description,
    lyrics: doc.lyrics,
    reviews: doc.reviews
});

const mapMix = (doc: any): Mix => ({
    key: doc.key,
    name: doc.name,
    audio_length: doc.audio_length,
    pictures: doc.pictures,
    created_time: doc.created_time,
    tags: doc.tags,
    url: doc.url
});

const mapProject = (doc: any): Project => ({
    name: doc.name,
    paragraphs: doc.paragraphs,
    photo: doc.photo,
    external_urls: doc.external_urls
});

export const getReleases = async (limit: number): Promise<Release[]> => {
    const db = await getDb();
    const releases = await db.collection("releases")
        .find({})
        .sort({ release_date: -1 })
        .limit(limit)
        .toArray();
    return releases.map(mapRelease);
};

export const getAlbums = async (): Promise<Release[]> => {
    const db = await getDb();
    const albums = await db.collection("releases")
        .find({ album_type: "album" })
        .sort({ release_date: -1 })
        .toArray();
    return albums.map(mapRelease);
};

export const getSingles = async (): Promise<Release[]> => {
    const db = await getDb();
    const singles = await db.collection("releases")
        .find({ album_type: "single" })
        .sort({ release_date: -1 })
        .toArray();
    return singles.map(mapRelease);
};

export const getAppearsOn = async (): Promise<Release[]> => {
    const db = await getDb();
    const appearsOn = await db.collection("releases")
        .find({ album_group: "appears_on" })
        .sort({ release_date: -1 })
        .toArray();
    return appearsOn.map(mapRelease);
};

export const getReleaseByName = async (name: string): Promise<Release | null> => {
    const db = await getDb();
    const release = await db.collection("releases")
        .findOne({ name: name });
    return release ? mapRelease(release) : null;
};

export const getMixes = async (limit: number): Promise<Mix[]> => {
    const db = await getDb();
    const mixes = await db.collection("mixes")
        .find({})
        .sort({ release_date: -1 })
        .limit(limit)
        .toArray();
    return mixes.map(mapMix);
};

export const getProjects = async (limit: number): Promise<Project[]> => {
    const db = await getDb();
    const projects = await db.collection("projects")
        .find({})
        .sort({ release_date: -1 })
        .limit(limit)
        .toArray();
    return projects.map(mapProject);
};

export const getContent = async (key: string): Promise<Content> => {
    const db = await getDb();
    const content = await db.collection("content")
        .findOne({ key: key });
    if (!content) {
        return { paragraphs: [], photos: [] };
    }
    return {
        paragraphs: content.paragraphs || [],
        photos: content.photos || []
    };
};